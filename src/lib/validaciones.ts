import { FormularioCitaData } from '@/types/cita';

export interface ErroresValidacion {
  nombrePaciente?: string;
  fecha?: string;
  hora?: string;
  motivo?: string;
  email?: string;
  telefono?: string;
}

export const validarFormularioCita = (data: FormularioCitaData): ErroresValidacion => {
  const errores: ErroresValidacion = {};

  // Validar nombre del paciente
  if (!data.nombrePaciente || data.nombrePaciente.trim().length < 2) {
    errores.nombrePaciente = 'El nombre debe tener al menos 2 caracteres';
  }

  // Validar fecha
  if (!data.fecha) {
    errores.fecha = 'La fecha es obligatoria';
  } else {
    const fechaSeleccionada = new Date(data.fecha);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
      errores.fecha = 'No se pueden agendar citas en fechas pasadas';
    }

    // No permitir domingos
    if (fechaSeleccionada.getDay() === 0) {
      errores.fecha = 'No se pueden agendar citas los domingos';
    }
  }

  // Validar hora (opcional). Si viene informada, validar rango.
  if (data.hora && data.hora.trim()) {
    const [horas, minutos] = data.hora.split(':').map(Number);
    if (
      Number.isFinite(horas) &&
      Number.isFinite(minutos) &&
      (horas < 8 || horas >= 18 || (horas === 17 && minutos > 0))
    ) {
      errores.hora = 'El horario de atención es de 8:00 AM a 6:00 PM';
    }
  }

  // Validar motivo
  if (!data.motivo || data.motivo.trim().length < 5) {
    errores.motivo = 'El motivo debe tener al menos 5 caracteres';
  }

  // Validar email si se proporciona
  if (data.email && data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errores.email = 'El email no tiene un formato válido';
    }
  }

  // Validar teléfono si se proporciona
  if (data.telefono && data.telefono.trim()) {
    const telefonoRegex = /^[0-9\-\+\(\)\s]{10,}$/;
    if (!telefonoRegex.test(data.telefono)) {
      errores.telefono = 'El teléfono debe tener al menos 10 dígitos';
    }
  }

  return errores;
};

export const tieneErrores = (errores: ErroresValidacion): boolean => {
  return Object.keys(errores).length > 0;
};
