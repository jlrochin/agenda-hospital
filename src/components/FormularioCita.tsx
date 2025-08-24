'use client';

import { useState, useEffect } from 'react';
import { FormularioCitaData } from '@/types/cita';
import { validarFormularioCita, tieneErrores, ErroresValidacion } from '@/lib/validaciones';
import { guardarCita } from '@/lib/citas';

interface FormularioCitaProps {
    onCitaGuardada?: () => void;
    fechaPreseleccionada?: string;
    onFechaCambiada?: (fecha: string) => void;
}

export default function FormularioCita({ onCitaGuardada, fechaPreseleccionada, onFechaCambiada }: FormularioCitaProps) {
    const [formData, setFormData] = useState<FormularioCitaData>({
        nombrePaciente: '',
        fecha: fechaPreseleccionada ?? '',
        hora: '', // Se eliminará del UI, pero mantenemos el campo por compatibilidad
        motivo: '',
        telefono: '',
        email: ''
    });

    const [errores, setErrores] = useState<ErroresValidacion>({});
    const [enviando, setEnviando] = useState(false);
    const [exitoso, setExitoso] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errores[name as keyof ErroresValidacion]) {
            setErrores(prev => ({ ...prev, [name]: undefined }));
        }

        if (name === 'fecha') {
            onFechaCambiada?.(value);
        }
    };

    // Sincroniza cambios de la fecha preseleccionada (p.ej., desde el calendario grande)
    // sin pisar lo que el usuario ya eligió si es igual
    useEffect(() => {
        if (fechaPreseleccionada && fechaPreseleccionada !== formData.fecha) {
            setFormData(prev => ({ ...prev, fecha: fechaPreseleccionada }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fechaPreseleccionada]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nuevosErrores = validarFormularioCita(formData);

        if (tieneErrores(nuevosErrores)) {
            setErrores(nuevosErrores);
            return;
        }

        setEnviando(true);

        try {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));

            guardarCita(formData);
            setExitoso(true);

            // Limpiar formulario
            setFormData({
                nombrePaciente: '',
                fecha: '',
                hora: '',
                motivo: '',
                telefono: '',
                email: ''
            });

            // Callback opcional
            onCitaGuardada?.();

            // Ocultar mensaje de éxito después de 3 segundos
            setTimeout(() => setExitoso(false), 3000);

        } catch (error) {
            console.error('Error al guardar la cita:', error);
        } finally {
            setEnviando(false);
        }
    };

    const obtenerFechaMinima = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };

    if (exitoso) {
        return (
            <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-emerald-900">
                            ¡Solicitud de hospitalización enviada exitosamente!
                        </p>
                        <p className="text-sm text-emerald-700 mt-1">
                            El equipo médico revisará su solicitud y le contactará pronto.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
            <div className="bg-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Solicitar Cita de Hospitalización</h2>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                {/* Nombre del Paciente */}
                <div>
                    <label htmlFor="nombrePaciente" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                    </label>
                    <input
                        type="text"
                        id="nombrePaciente"
                        name="nombrePaciente"
                        value={formData.nombrePaciente}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${errores.nombrePaciente ? 'border-red-500' : 'border-slate-300'
                            }`}
                        placeholder="Ingrese su nombre completo"
                    />
                    {errores.nombrePaciente && (
                        <p className="mt-1 text-sm text-red-600">{errores.nombrePaciente}</p>
                    )}
                </div>

                {/* Fecha */}
                <div>
                    <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de la cita *
                    </label>
                    <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChange}
                        min={obtenerFechaMinima()}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.fecha ? 'border-red-500' : 'border-slate-300'
                            }`}
                    />
                    {errores.fecha && (
                        <p className="mt-1 text-sm text-red-600">{errores.fecha}</p>
                    )}
                </div>

                {/* Motivo */}
                <div>
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo de hospitalización *
                    </label>
                    <textarea
                        id="motivo"
                        name="motivo"
                        value={formData.motivo}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errores.motivo ? 'border-red-500' : 'border-slate-300'
                            }`}
                        placeholder="Describe la condición médica que requiere hospitalización"
                    />
                    {errores.motivo && (
                        <p className="mt-1 text-sm text-red-600">{errores.motivo}</p>
                    )}
                </div>

                {/* Teléfono */}
                <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono de contacto
                    </label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${errores.telefono ? 'border-red-500' : 'border-slate-300'
                            }`}
                        placeholder="Ej: +1 234 567 8900"
                    />
                    {errores.telefono && (
                        <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${errores.email ? 'border-red-500' : 'border-slate-300'
                            }`}
                        placeholder="su.email@ejemplo.com"
                    />
                    {errores.email && (
                        <p className="mt-1 text-sm text-red-600">{errores.email}</p>
                    )}
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={enviando}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enviando ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                        }`}
                >
                    {enviando ? 'Enviando solicitud...' : 'Solicitar Hospitalización'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Los campos marcados con * son obligatorios
                </p>
            </form>
        </div>
    );
}
