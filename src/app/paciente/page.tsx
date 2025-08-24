"use client";
import { useState, useMemo } from 'react';
import FormularioCita from '@/components/FormularioCita';
import CalendarioGrande from '@/components/CalendarioGrande';

export default function PacientePage() {
    const todayYMD = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(todayYMD);

    return (
        <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/60">
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Solicitar Cita de Hospitalización
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                        Complete el siguiente formulario para solicitar su cita de hospitalización.
                        El equipo médico revisará su solicitud y le contactará pronto.
                    </p>
                </div>

                {/* Información Importante */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">
                                Información Importante sobre Hospitalización
                            </h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Las solicitudes de hospitalización se procesan de 8:00 AM a 6:00 PM</li>
                                    <li>El personal médico evaluará su caso en un plazo de 24 horas</li>
                                    <li>Mantenga disponible su historial médico reciente</li>
                                    <li>En casos de emergencia, diríjase directamente al servicio de urgencias</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Calendario grande e intuitivo */}
                    <div>
                        <CalendarioGrande
                            value={fechaSeleccionada}
                            onDateChangeAction={(f) => setFechaSeleccionada(f)}
                            minDate={todayYMD}
                            disableSundays
                        />
                    </div>

                    {/* Formulario de Cita */}
                    <div>
                        <FormularioCita
                            fechaPreseleccionada={fechaSeleccionada}
                            onFechaCambiada={(f) => setFechaSeleccionada(f)}
                        />
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ¿Necesita ayuda?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Teléfono</p>
                                <p className="text-sm text-gray-500">(555) 123-4567</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Email</p>
                                <p className="text-sm text-gray-500">citas@hospital.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
