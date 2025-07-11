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

  export async function downloadPdfByPlaca(placa: string) {
    const res = await fetch(`${URL_API}/api/multas/pdf/${placa}`);
    if (!res.ok) throw new Error(await res.text());
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Multas_${placa}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  export async function enviarPdfPorCorreo(placa: string, email: string) {
    const res = await fetch(`${URL_API}/api/multas/enviar-pdf`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ Placa: placa, Email: email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{
      mensaje: string;
      email: string;
      placa: string;
      fecha_envio: string;
    }>;
  }

  // === PREDIALES API FUNCTIONS ===

  export async function fetchPrediales(domicilioId: number) {
    const res = await fetch(`${URL_API}/api/prediales/${domicilioId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<Array<{
      id_predial: number;
      monto: string;
      fecha_expedida: string;
      fecha_limite: string;
    }>>;
  }
  
  export async function pagarPredial(id_predial: number, monto: string) {
    const montoNumber = parseFloat(monto.replace(/,/g, ""));
    const res = await fetch(`${URL_API}/api/prediales/pagar`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ IdPredial: id_predial, MontoPagar: montoNumber }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  export async function fetchTotalPrediales(domicilioId: number) {
    const res = await fetch(`${URL_API}/api/prediales/total/${domicilioId}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{ domicilioId: number; total_a_pagar: number }>;
  }
  
  export async function pagarTotalPrediales(domicilioId: number, monto: number) {
    const res = await fetch(`${URL_API}/api/prediales/pagar-total`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ DomicilioId: domicilioId, MontoPagar: monto }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  export async function downloadPdfByDomicilio(domicilioId: number) {
    const res = await fetch(`${URL_API}/api/prediales/pdf/${domicilioId}`);
    if (!res.ok) throw new Error(await res.text());
    
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prediales_${domicilioId}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  
  export async function enviarPdfPredialPorCorreo(domicilioId: number, email: string) {
    const res = await fetch(`${URL_API}/api/prediales/enviar-pdf`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ DomicilioId: domicilioId, Email: email }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<{
      mensaje: string;
      email: string;
      domicilio: number;
      fecha_envio: string;
    }>;
  }