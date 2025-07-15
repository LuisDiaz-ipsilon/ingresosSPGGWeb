import { useEffect, useState } from "react";
import { fetchMultas, pagarMulta, fetchTotal, pagarTotal, downloadPdfByPlaca, enviarPdfPorCorreo } from "../lib/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PagoModal } from "../components/PagoModal";

export function MultasPage() {
  const [placa, setPlaca] = useState("");
  const [multas, setMultas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<any>(null);

  const [consultado, setConsultado] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [montoModal, setMontoModal] = useState(0);
  const [pagoCallback, setPagoCallback] = useState<() => Promise<void>>(async () => {});
  
  // Estados para el modal de envío de email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fechaFormateada = now.toLocaleString("es-MX", {
    weekday: "long",
    year:    "numeric",
    month:   "2-digit",
    day:     "2-digit",
    hour:    "2-digit",
    minute:  "2-digit",
    second:  "2-digit"
  });

  const consultar = async () => {
    const data = await fetchMultas(placa);
    setMultas(data);
    const tot = await fetchTotal(placa);
    setTotal(tot.total_a_pagar);
    setConsultado(true); 
  };

  const enviarPdf = async () => {
    if (!email.trim()) {
      alert("Por favor ingrese un email válido");
      return;
    }
    
    setEnviandoEmail(true);
    setMensajeEnvio("");
    
    try {
      const resultado = await enviarPdfPorCorreo(placa, email);
      setMensajeEnvio(`PDF enviado correctamente a ${resultado.email}`);
      setEmail("");
      setTimeout(() => {
        setEmailModalOpen(false);
        setMensajeEnvio("");
      }, 2000);
    } catch (error) {
      setMensajeEnvio(`Error al enviar PDF: ${error}`);
    } finally {
      setEnviandoEmail(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consulta de Multas</h1>
      
      <p className="text-sm text-gray-600 mb-2">
        {fechaFormateada}
      </p>

      <div className="flex space-x-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Ingresa placa"
          value={placa}
          onChange={e => setPlaca(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={consultar}
        >
          Consultar
        </button>
        {consultado && multas.length !== 0 && (
          <>
            <button
              className="bg-green-600 text-white px-4 rounded"
              onClick={() => downloadPdfByPlaca(placa)}
            >
              Descargar PDF
            </button>
            <button
              className="bg-blue-600 text-white px-4 rounded"
              onClick={() => setEmailModalOpen(true)}
            >
              Enviar por Email
            </button>
          </>
        )}
      </div>

      {consultado && multas.length === 0 && (
        <p className="text-center text-gray-600 py-4">
          No hay multas pendientes para la placa <strong>{placa}</strong>.
        </p>
      )}

      {consultado && multas.length !== 0 && (
        <>
            <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["ID","Tipo","Monto","Expedido","Límite","Acciones"].map(h => (
                  <th key={h} className="border px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {multas.map(m => (
                <tr
                  key={m.id_multa}
                  className={`hover:bg-gray-200 cursor-pointer ${m.pagado ? 'opacity-50' : ''}`}
                >
                  <td className="border px-2 py-1">{m.id_multa}</td>
                  <td className="border px-2 py-1">{m.tipo_multa}</td>
                  <td className="border px-2 py-1">${m.monto}</td>
                  <td className="border px-2 py-1">{m.fecha_expedida}</td>
                  <td className="border px-2 py-1">{m.fecha_limite}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => setSelected(m)}
                    >
                      Mapa
                    </button>
                    {m.pagado ? (
                      <button disabled={true} className="!bg-gray-700 px-2 py-1 rounded !text-green-600 !font-semibold !cursor-not-allowed">Pagado</button>
                      ) : (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={e => {
                          e.stopPropagation();
                          setMontoModal(m.monto);
                          setPagoCallback(() => async () => {
                            await pagarMulta(m.id_multa, m.monto);
                            await consultar(); // refresca la tabla y total
                          });
                          setModalOpen(true);
                        }}
                      >
                        Pagar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {multas.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={5} className="text-right font-semibold py-2 pr-4">
                    Total a pagar:
                  </td>
                  <td className="border px-2 py-2 font-bold">
                    ${total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>

          <button
            className={`mt-2 px-4 py-2 rounded ${
              total > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
            disabled={total === 0}
            onClick={() => {
              setMontoModal(total);
              setPagoCallback(() => async () => {
                await pagarTotal(placa, total);
                await consultar();
              });
              setModalOpen(true);
            }}
          >
            Pagar Total (${total.toLocaleString("en-US",{minimumFractionDigits:2})})
          </button>
        </>
      )}
      
      {/* Mapa */}
      {selected && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Ubicación de multa {selected.id_multa}</h2>
          <MapContainer
            key={selected.id_multa}
            center={[+selected.latitude, +selected.longitude]}
            zoom={16}
            style={{ height: 300 }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[+selected.latitude, +selected.longitude]}>
              <Popup>{selected.direccion}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <PagoModal
        open={modalOpen}
        monto={montoModal}
        onClose={() => setModalOpen(false)}
        onConfirm={pagoCallback}
      />
      
      {/* Modal para enviar PDF por email */}
      {emailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Enviar PDF por Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              Se enviará el PDF de las multas de la placa <strong>{placa}</strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de destino:
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={enviandoEmail}
              />
            </div>
            
            {mensajeEnvio && (
              <div className={`mb-4 p-3 rounded text-sm ${
                mensajeEnvio.includes('Error') 
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-green-100 text-green-800 border border-green-300'
              }`}>
                {mensajeEnvio}
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-50"
                onClick={() => {
                  setEmailModalOpen(false);
                  setEmail("");
                  setMensajeEnvio("");
                }}
                disabled={enviandoEmail}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={enviarPdf}
                disabled={enviandoEmail || !email.trim()}
              >
                {enviandoEmail ? 'Enviando...' : 'Enviar PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
