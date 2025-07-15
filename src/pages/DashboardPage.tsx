import { useDashboardData } from "../../src/hooks/useDashboard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DashboardPage() {
  const {
    ingresos,
    morosidadMes,
    morosidadGbl,
    saldoPred,
    saldoMultas,
    zonasPred,
    zonasVel
  } = useDashboardData();

  if (
    ingresos.isLoading || morosidadMes.isLoading || morosidadGbl.isLoading ||
    saldoPred.isLoading || saldoMultas.isLoading ||
    zonasPred.isLoading || zonasVel.isLoading
  ) return <p className="p-6">Cargando…</p>;

  if (ingresos.isError) return <p>Error: {String(ingresos.error)}</p>;

  const kpis = [
    { label: "Morosidad Prediales (%)", value: morosidadGbl.data!.indice_morosidad_prediales },
    { label: "Morosidad Multas (%)",    value: morosidadGbl.data!.indice_morosidad_multas },
    { label: "Por Cobrar Prediales ($)",     value: saldoPred.data!.saldo_por_pagar },
    { label: "Por Cobrar Multas ($)",        value: saldoMultas.data!.saldo_por_pagar }
  ];

  const ingresosData = ingresos.data!.map(d => ({
    mes: d.mes_inicio.slice(0,7), // YYYY-MM
    expedido: d.expedido_total,
    pagado:   d.pagado_total
  }));

  const morosidadData = morosidadMes.data!.map(d => ({
    mes: d.mes_inicio.slice(0,7),
    indice: d.indice_morosidad
  }));

  return (
    <div className="space-y-8 p-6">
      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="bg-white shadow rounded p-4 text-center">
            <p className="text-sm text-gray-500">{k.label}</p>
            <p className="text-2xl font-bold">
              {k.label.includes("%") ? `${k.value.toFixed(2)}%`
                                      : `$${k.value.toLocaleString("en-US",{minimumFractionDigits:2})}`}
            </p>
          </div>
        ))}
      </div>

      {/* Ingresos Chart */}
      <div className="bg-white shadow rounded p-4 h-72">
        <h2 className="font-semibold mb-2">Ingresos últimos 6 meses</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ingresosData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="expedido" stackId="1" name="Expedido"  fillOpacity={0.6} />
            <Area type="monotone" dataKey="pagado"   stackId="1" name="Pagado"    fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Morosidad */}
      <div className="bg-white shadow rounded p-4 h-72">
        <h2 className="font-semibold mb-2">% Morosidad por mes</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={morosidadData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="indice" name="% Morosidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mapas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Prediales */}
        <div className="bg-white shadow rounded">
          <h2 className="font-semibold p-4">Heatmap Prediales Morosos (5 km)</h2>
          <MapContainer center={[25.67,-100.31]} zoom={11} style={{height:360}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {zonasPred.data!.map(z => (
              <CircleMarker
                key={`${z.grid_x}-${z.grid_y}`}
                center={[z.center_latitude, z.center_longitude]}
                radius={z.indice_morosidad-80}
                pathOptions={{ fillOpacity: 0.5 }}
              >
                <LTooltip>
                  {`Morosidad: ${z.indice_morosidad}% (${z.total_moroso.toLocaleString()})`}
                </LTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Exceso de velocidad */}
        <div className="bg-white shadow rounded">
          <h2 className="font-semibold p-4">Multas Exceso de Velocidad (5 km)</h2>
          <MapContainer center={[25.67,-100.31]} zoom={11} style={{height:360}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {zonasVel.data!.map(z => (
              <CircleMarker
                key={`${z.grid_x}-${z.grid_y}`}
                center={[z.center_latitude, z.center_longitude]}
                radius={Math.min(z.total_exceso_velocidad)}
                pathOptions={{ color:"red", fillOpacity:0.4 }}
              >
                <LTooltip>
                  {`Multas: ${z.total_exceso_velocidad}`}
                </LTooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
