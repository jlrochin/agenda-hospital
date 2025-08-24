'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListaPacientes from '@/components/ListaPacientes';
import CalendarioMedicoNuevo from '@/components/CalendarioMedicoNuevo';
import { obtenerCitas, actualizarFechaCita, eliminarCita, eliminarCitasVencidas } from '@/lib/citas';
import { Cita } from '@/types/cita';

export default function MedicoPage() {
    const [actualizarLista, setActualizarLista] = useState(0);
    const [citas, setCitas] = useState<Cita[]>([]);
    const [vistaActual, setVistaActual] = useState<'lista' | 'calendario'>('lista');

    useEffect(() => {
        // Eliminar citas vencidas automáticamente al cargar
        const citasEliminadas = eliminarCitasVencidas();
        if (citasEliminadas > 0) {
            console.log(`Se eliminaron ${citasEliminadas} citas vencidas automáticamente`);
        }
        
        const citasActuales = obtenerCitas();
        setCitas(citasActuales);
    }, [actualizarLista]);

    const handleActualizacion = () => {
        setActualizarLista(prev => prev + 1);
    };

    const handleCitaMovidaAction = (citaId: string, nuevaFecha: string) => {
        const exito = actualizarFechaCita(citaId, nuevaFecha);
        if (exito) {
            handleActualizacion();
        }
    };

    const handleCitaCanceladaAction = (citaId: string, motivoCancelacion: string, reprogramar: boolean) => {
        // En una aplicación real, aquí se enviaría una notificación al paciente
        console.log(`Cita ${citaId} cancelada. Motivo: ${motivoCancelacion}. Reprogramar: ${reprogramar}`);
        
        const exito = eliminarCita(citaId);
        if (exito) {
            if (reprogramar) {
                alert(`Cita cancelada para reprogramación.\nEl paciente será contactado para una nueva fecha.\nMotivo: ${motivoCancelacion}`);
            } else {
                alert(`Cita cancelada definitivamente.\nEl paciente será notificado.\nMotivo: ${motivoCancelacion}`);
            }
            handleActualizacion();
        }
    };

    const handleEliminarVencidas = () => {
        const citasEliminadas = eliminarCitasVencidas();
        if (citasEliminadas > 0) {
            alert(`Se eliminaron ${citasEliminadas} citas vencidas.`);
            handleActualizacion();
        } else {
            alert('No hay citas vencidas para eliminar.');
        }
    };    return (
        <div className="bg-gradient-to-br from-emerald-50/60 to-green-50/60">
            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-emerald-100 rounded-full">
                            <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Panel de Gestión Hospitalaria
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                        Administre las citas de hospitalización, consulte información de pacientes y
                        monitoree la ocupación hospitalaria desde este panel de control.
                        mantenga su agenda organizada.
                    </p>
                </div>

                {/* Acciones Rápidas */}
                <div className="mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                        <div className="flex flex-wrap gap-3">
                            {/* Selector de vista */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setVistaActual('lista')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${vistaActual === 'lista'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                    Lista
                                </button>
                                <button
                                    onClick={() => setVistaActual('calendario')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${vistaActual === 'calendario'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Calendario
                                </button>
                            </div>

                            <button
                                onClick={handleActualizacion}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Actualizar Citas
                            </button>

                            <button
                                onClick={handleEliminarVencidas}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar Vencidas
                            </button>

                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Imprimir Lista
                            </button>

                            <Link
                                href="/paciente"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Nueva Cita
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Vista dinámica: Lista o Calendario */}
                {vistaActual === 'lista' ? (
                    <ListaPacientes actualizarLista={actualizarLista} />
                ) : (
                    <div className="mb-8">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Calendario Interactivo
                            </h3>
                            <p className="text-sm text-gray-600">
                                Arrastra las tarjetas de los pacientes para cambiar la fecha de sus citas.
                                Usa el botón ❌ para cancelar una cita (con opción de reprogramar).
                                No se pueden mover citas a fechas pasadas.
                            </p>
                        </div>
                        <CalendarioMedicoNuevo
                            citas={citas}
                            onCitaMovidaAction={handleCitaMovidaAction}
                            onCitaCanceladaAction={handleCitaCanceladaAction}
                        />
                    </div>
                )}

                {/* Información Adicional */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recordatorios
                        </h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5">•</span>
                                <span className="ml-2">Revisar historiales médicos antes de cada cita</span>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5">•</span>
                                <span className="ml-2">Confirmar asistencia con pacientes el día anterior</span>
                            </li>
                            <li className="flex items-start">
                                <span className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5">•</span>
                                <span className="ml-2">Actualizar notas post-consulta</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Contacto de Emergencia
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="text-gray-900 font-medium">Urgencias: </span>
                                <span className="text-red-600 font-semibold">911</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span className="text-gray-900 font-medium">Hospital: </span>
                                <span className="text-gray-600">(555) 123-4567</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                                <span className="text-gray-900 font-medium">IT Support: </span>
                                <span className="text-gray-600">soporte@hospital.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
