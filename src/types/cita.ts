export interface Cita {
  id: string;
  nombrePaciente: string;
  fecha: string;
  hora?: string;
  motivo: string;
  telefono?: string;
  email?: string;
  fechaCreacion: string;
}

export interface FormularioCitaData {
  nombrePaciente: string;
  fecha: string;
  hora?: string;
  motivo: string;
  telefono?: string;
  email?: string;
}
