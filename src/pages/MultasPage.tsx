// src/pages/MultasPage.tsx
import { useState } from "react";
import { fetchMultas, pagarMulta, fetchTotal, pagarTotal } from "../lib/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PagoModal } from "../components/PagoModal";

export function MultasPage() {
  const [placa, setPlaca] = useState("");
  const [multas, setMultas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [montoModal, setMontoModal] = useState(0);
  const [pagoCallback, setPagoCallback] = useState<() => Promise<void>>(async () => {});


  const consultar = async () => {
    const data = await fetchMultas(placa);
    setMultas(data);
    const tot = await fetchTotal(placa);
    setTotal(tot.total_a_pagar);
  };

  return (
    <div className="p-6 space-y-4">
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
      </div>

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
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="border px-2 py-1">{m.id_multa}</td>
              <td className="border px-2 py-1">{m.tipo_multa}</td>
              <td className="border px-2 py-1">${m.monto}</td>
              <td className="border px-2 py-1">{m.fecha_expedida}</td>
              <td className="border px-2 py-1">{m.fecha_limite}</td>
              <td className="border px-2 py-1">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setSelected(m)}
                >
                  Mapa
                </button>
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
        className="bg-green-600 text-white px-4 rounded"
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
    </div>
  );
}
