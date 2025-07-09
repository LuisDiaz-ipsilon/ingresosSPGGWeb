import { useState } from "react";

interface PagoModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;    // callback que hará el POST real
  monto: number;
}

export function PagoModal({ open, onClose, onConfirm, monto }: PagoModalProps) {
  const [card, setCard]       = useState("4555 3431 3232 2323");
  const [name, setName]       = useState("Luis Diaz");
  const [exp, setExp]         = useState("22 09");
  const [cvv, setCvv]         = useState("123");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handlePay = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 4000));
    await onConfirm();
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold text-blue-800">Pago con tarjeta</h2>

        {loading ? (
          <div className="flex flex-col items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M22 12a10 10 0 01-10 10" stroke="currentColor" strokeWidth="4" />
            </svg>
            <p className="mt-4">Procesando pago…</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Número de tarjeta"
                value={card}
                onChange={e => setCard(e.target.value)}
              />
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Nombre en la tarjeta"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <div className="flex space-x-2">
                <input
                  className="flex-1 border px-3 py-2 rounded"
                  placeholder="MM/AA"
                  value={exp}
                  onChange={e => setExp(e.target.value)}
                />
                <input
                  className="w-20 border px-3 py-2 rounded"
                  placeholder="CVV"
                  value={cvv}
                  onChange={e => setCvv(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                className="px-4 py-2 rounded border"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handlePay}
                disabled={loading || !card || !name || !exp || !cvv}
              >
                Confirmar pago – ${monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
