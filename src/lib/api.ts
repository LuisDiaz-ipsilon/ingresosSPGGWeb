const URL_API = "https://localhost:7131";

export async function fetchMultas(placa: string) {
    const res = await fetch(`${URL_API}/api/multas/${placa}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Array<{
      id_multa: number;
      tipo_multa: string;
      monto: string;
      direccion: string;
      fecha_expedida: string;
      fecha_limite: string;
      latitude: string;
      longitude: string;
    }>>;
  }
  
  export async function pagarMulta(id_multa: number, monto: string) {
    const montoNumber = parseFloat(monto.replace(/,/g, ""));
    const res = await fetch(`${URL_API}/api/multas/pagar`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ IdMulta: id_multa, MontoPagar: montoNumber }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  export async function fetchTotal(placa: string) {
    const res = await fetch(`${URL_API}/api/multas/total/${placa}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ placa:string; total_a_pagar:number }>;
  }
  
  export async function pagarTotal(placa: string, monto: number) {
    const res = await fetch(`${URL_API}/api/multas/pagar-total`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ Placa: placa, MontoPagar: monto }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  