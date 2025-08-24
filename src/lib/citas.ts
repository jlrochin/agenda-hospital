import { Cita, FormularioCitaData } from '@/types/cita';

// Simulamos una base de datos local usando localStorage
const CITAS_KEY = 'hospital-citas';

export const obtenerCitas = (): Cita[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const citasString = localStorage.getItem(CITAS_KEY);
    return citasString ? JSON.parse(citasString) : [];
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
};

export const guardarCita = (dataCita: FormularioCitaData): Cita => {
  const nuevaCita: Cita = {
    id: generateId(),
    ...dataCita,
    fechaCreacion: new Date().toISOString(),
  };

  const citasExistentes = obtenerCitas();
  const citasActualizadas = [...citasExistentes, nuevaCita];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CITAS_KEY, JSON.stringify(citasActualizadas));
  }
  
  return nuevaCita;
};

export const obtenerCitasPorFecha = (fecha: string): Cita[] => {
  const todasLasCitas = obtenerCitas();
  return todasLasCitas.filter(cita => cita.fecha === fecha);
};

export const obtenerCitasOrdenadas = (): Cita[] => {
  const citas = obtenerCitas();
  return citas.sort((a, b) => {
  const fechaA = new Date(`${a.fecha} ${a.hora ?? '00:00'}`);
  const fechaB = new Date(`${b.fecha} ${b.hora ?? '00:00'}`);
  return fechaA.getTime() - fechaB.getTime();
  });
};

export const actualizarFechaCita = (citaId: string, nuevaFecha: string): boolean => {
  const citas = obtenerCitas();
  const indice = citas.findIndex(cita => cita.id === citaId);
  
  if (indice === -1) return false;
  
  citas[indice].fecha = nuevaFecha;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CITAS_KEY, JSON.stringify(citas));
  }
  
  return true;
};

export const eliminarCita = (citaId: string): boolean => {
  const citas = obtenerCitas();
  const indice = citas.findIndex(cita => cita.id === citaId);
  
  if (indice === -1) return false;
  
  const citasActualizadas = citas.filter(cita => cita.id !== citaId);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CITAS_KEY, JSON.stringify(citasActualizadas));
  }
  
  return true;
};

export const eliminarCitasVencidas = (): number => {
  const citas = obtenerCitas();
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0); // Establecer a medianoche para comparación solo de fecha
  
  const citasVigentes = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha);
    fechaCita.setHours(0, 0, 0, 0);
    return fechaCita >= fechaHoy; // Mantener solo las citas de hoy en adelante
  });
  
  const citasEliminadas = citas.length - citasVigentes.length;
  
  if (citasEliminadas > 0 && typeof window !== 'undefined') {
    localStorage.setItem(CITAS_KEY, JSON.stringify(citasVigentes));
  }
  
  return citasEliminadas;
};

export const obtenerCitasVigentes = (): Cita[] => {
  const citas = obtenerCitas();
  const fechaHoy = new Date();
  fechaHoy.setHours(0, 0, 0, 0);
  
  return citas.filter(cita => {
    const fechaCita = new Date(cita.fecha);
    fechaCita.setHours(0, 0, 0, 0);
    return fechaCita >= fechaHoy;
  });
};

// Función para generar un ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para formatear fecha
export const formatearFecha = (fecha: string): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Función para formatear hora
export const formatearHora = (hora: string): string => {
  if (!hora) return '';
  const [horas, minutos] = hora.split(':');
  const date = new Date();
  date.setHours(parseInt(horas), parseInt(minutos));
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
