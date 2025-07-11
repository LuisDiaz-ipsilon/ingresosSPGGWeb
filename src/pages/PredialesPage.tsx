import { useState } from "react";
import { fetchPrediales, pagarPredial, fetchTotalPrediales, pagarTotalPrediales, downloadPdfByDomicilio, enviarPdfPredialPorCorreo } from "../lib/api";
import { PagoModal } from "../components/PagoModal";

export function PredialesPage() {
  const [domicilioId, setDomicilioId] = useState("");
  const [prediales, setPrediales] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [consultado, setConsultado] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [montoModal, setMontoModal] = useState(0);
  const [pagoCallback, setPagoCallback] = useState<() => Promise<void>>(async () => {});
  
  // Estados para el modal de envío de email
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  const consultar = async () => {
    const domicilioNumber = parseInt(domicilioId);
    if (isNaN(domicilioNumber)) {
      alert("Por favor ingrese un número de domicilio válido");
      return;
    }

    const data = await fetchPrediales(domicilioNumber);
    setPrediales(data);
    const tot = await fetchTotalPrediales(domicilioNumber);
    setTotal(tot.total_a_pagar);
    setConsultado(true); 
  };

  const resetConsulta = () => {
    setDomicilioId("");
    setPrediales([]);
    setTotal(0);
    setConsultado(false);
  };

  const enviarPdf = async () => {
    if (!email.trim()) {
      alert("Por favor ingrese un email válido");
      return;
    }
    
    const domicilioNumber = parseInt(domicilioId);
    setEnviandoEmail(true);
    setMensajeEnvio("");
    
    try {
      const resultado = await enviarPdfPredialPorCorreo(domicilioNumber, email);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consulta de Prediales</h1>
      
      <div className="flex space-x-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Ingresa número de domicilio"
          type="number"
          value={domicilioId}
          onChange={e => setDomicilioId(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={consultar}
        >
          Consultar
        </button>
        {consultado && (
          <>
            <button
              className="bg-green-600 text-white px-4 rounded"
              onClick={() => downloadPdfByDomicilio(parseInt(domicilioId))}
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

      {consultado && (
        <>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["ID Predial","Monto","Fecha Expedida","Fecha Límite","Acciones"].map(h => (
                  <th key={h} className="border px-2 py-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prediales.map(p => (
                <tr
                  key={p.id_predial}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-2 py-1">{p.id_predial}</td>
                  <td className="border px-2 py-1">${p.monto}</td>
                  <td className="border px-2 py-1">{p.fecha_expedida}</td>
                  <td className="border px-2 py-1">{p.fecha_limite}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={e => {
                        e.stopPropagation();
                        setMontoModal(parseFloat(p.monto.replace(/,/g, "")));
                        setPagoCallback(() => async () => {
                          await pagarPredial(p.id_predial, p.monto);
                          await consultar(); // refresca la tabla y total
                        });
                        setModalOpen(true);
                      }}
                    >
                      Pagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {prediales.length > 0 && (
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={4} className="text-right font-semibold py-2 pr-4">
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
                await pagarTotalPrediales(parseInt(domicilioId), total);
                await consultar();
              });
              setModalOpen(true);
            }}
          >
            Pagar Total (${total.toLocaleString("en-US",{minimumFractionDigits:2})})
          </button>
        </>
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
              Se enviará el PDF de los prediales del domicilio <strong>{domicilioId}</strong>
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
