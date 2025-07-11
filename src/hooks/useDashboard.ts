import { useQuery } from "@tanstack/react-query";
import {
  fetchIngresosUlt6Meses,
  fetchMorosidadMes,
  fetchMorosidadGlobal,
  fetchSaldoPrediales,
  fetchSaldoMultas,
  fetchPredialesZonas5Km,
  fetchMultasVelocidadZonas5Km
} from "../../src/lib/api";
import type {
  IngresoUlt6Meses, MorosidadMensual, MorosidadGlobal,
  PredialesZona5Km, Saldo, MultasVelocidadZona5Km
} from "@/../../src/lib/dashboardUtils";

export function useDashboardData() {
    const ingresos = useQuery<IngresoUlt6Meses[]>({
      queryKey: ["ingresos6m"],
      queryFn : fetchIngresosUlt6Meses
    });
  
    const morosidadMes = useQuery<MorosidadMensual[]>({
      queryKey: ["morosidadMes"],
      queryFn : fetchMorosidadMes
    });
  
    const morosidadGbl = useQuery<MorosidadGlobal>({
      queryKey: ["morosidadGbl"],
      queryFn : fetchMorosidadGlobal
    });
  
    const saldoPred = useQuery<Saldo>({
      queryKey: ["saldoPred"],
      queryFn : fetchSaldoPrediales
    });
  
    const saldoMultas = useQuery<Saldo>({
      queryKey: ["saldoMultas"],
      queryFn : fetchSaldoMultas
    });
  
    const zonasPred = useQuery<PredialesZona5Km[]>({
      queryKey: ["zonasPred"],
      queryFn : fetchPredialesZonas5Km
    });
  
    const zonasVel = useQuery<MultasVelocidadZona5Km[]>({
      queryKey: ["zonasVel"],
      queryFn : fetchMultasVelocidadZonas5Km
    });
  
    return {
      ingresos,
      morosidadMes,
      morosidadGbl,
      saldoPred,
      saldoMultas,
      zonasPred,
      zonasVel
    };
  }
