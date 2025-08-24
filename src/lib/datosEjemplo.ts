import { Cita } from '@/types/cita';

// Datos de ejemplo para demostrar el funcionamiento del sistema
export const citasEjemplo: Cita[] = [
  {
    id: '1',
    nombrePaciente: 'María García López',
    fecha: '2025-07-21',
    hora: '09:00',
    motivo: 'Consulta de rutina y revisión de exámenes de laboratorio',
    telefono: '+34 666 123 456',
    email: 'maria.garcia@email.com',
    fechaCreacion: '2025-07-20T10:30:00.000Z'
  },
  {
    id: '2',
    nombrePaciente: 'Juan Carlos Rodríguez',
    fecha: '2025-07-21',
    hora: '10:30',
    motivo: 'Dolor de cabeza recurrente y mareos',
    telefono: '+34 677 987 654',
    email: 'juan.rodriguez@email.com',
    fechaCreacion: '2025-07-20T11:15:00.000Z'
  },
  {
    id: '3',
    nombrePaciente: 'Ana Martínez Sánchez',
    fecha: '2025-07-22',
    hora: '08:00',
    motivo: 'Control de hipertensión arterial',
    telefono: '+34 688 555 777',
    email: 'ana.martinez@email.com',
    fechaCreacion: '2025-07-20T14:20:00.000Z'
  },
  {
    id: '4',
    nombrePaciente: 'Pedro González Ruiz',
    fecha: '2025-07-22',
  hora: '11:00',
    motivo: 'Revisión post-operatoria y cambio de vendajes',
    telefono: '+34 699 111 222',
    email: '',
    fechaCreacion: '2025-07-20T16:45:00.000Z'
  },
  {
    id: '5',
    nombrePaciente: 'Carmen Fernández Torres',
    fecha: '2025-07-23',
    hora: '14:00',
    motivo: 'Consulta dermatológica por irritación en la piel',
    telefono: '+34 655 444 888',
    email: 'carmen.fernandez@email.com',
    fechaCreacion: '2025-07-20T18:30:00.000Z'
  }
];

// Función para inicializar datos de ejemplo
export const inicializarDatosEjemplo = () => {
  if (typeof window !== 'undefined') {
    const datosExistentes = localStorage.getItem('hospital-citas');
    if (!datosExistentes) {
      localStorage.setItem('hospital-citas', JSON.stringify(citasEjemplo));
    }
  }
};
