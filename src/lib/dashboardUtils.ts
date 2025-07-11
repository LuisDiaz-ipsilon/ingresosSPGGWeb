//DASHBOARD
export interface IngresoUlt6Meses {
  mes_inicio: string;
  expedido_total: number;
  pagado_total: number;
}

export interface MorosidadMensual {
  mes_inicio: string;
  total_expedido: number;
  total_moroso: number;
  indice_morosidad: number;   
}

export interface MorosidadGlobal {
  indice_morosidad_prediales: number;
  indice_morosidad_multas:    number;
}

export interface PredialesZona5Km {
  mes_inicio: string;
  grid_x: number;
  grid_y: number;
  center_latitude:  number;
  center_longitude: number;
  total_prediales:  number;
  total_expedido:   number;
  total_moroso:     number;
  indice_morosidad: number;   
}

export interface Saldo {
  saldo_por_pagar: number;
}

export interface MultasVelocidadZona5Km {
  grid_x: number;
  grid_y: number;
  center_latitude:  number;
  center_longitude: number;
  total_exceso_velocidad: number;
}