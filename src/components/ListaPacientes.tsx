'use client';

import { useState, useEffect } from 'react';
import { Cita } from '@/types/cita';
import { obtenerCitasOrdenadas, formatearFecha, formatearHora, eliminarCitasVencidas } from '@/lib/citas';

interface ListaPacientesProps {
    actualizarLista?: number; // Para forzar actualización
}

export default function ListaPacientes({ actualizarLista }: ListaPacientesProps) {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [filtroFecha, setFiltroFecha] = useState<string>('');
    const [cargando, setCargando] = useState(true);

    const cargarCitas = () => {
        setCargando(true);
        setTimeout(() => {
            // Eliminar citas vencidas antes de cargar
            eliminarCitasVencidas();
            const citasObtenidas = obtenerCitasOrdenadas();
            setCitas(citasObtenidas);
            setCargando(false);
        }, 300); // Simular delay de carga
    };

    useEffect(() => {
        cargarCitas();
    }, [actualizarLista]);

    const citasFiltradas = filtroFecha
        ? citas.filter(cita => cita.fecha === filtroFecha)
        : citas;

    const contarCitasPorFecha = (fecha: string) => {
        return citas.filter(cita => cita.fecha === fecha).length;
    };

    const fechasUnicas = Array.from(new Set(citas.map(cita => cita.fecha))).sort();

    const obtenerFechaHoy = () => {
        const hoy = new Date();
        return hoy.toISOString().split('T')[0];
    };

    const esCitaHoy = (fecha: string) => {
        return fecha === obtenerFechaHoy();
    };

    const esCitaVencida = (fecha: string, hora?: string) => {
        const ahora = new Date();
        const fechaCita = new Date(`${fecha} ${hora ?? '23:59'}`);
        return fechaCita < ahora;
    };

    if (cargando) {
        return (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Panel del Médico</h2>
                </div>
                <div className="p-6">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
            <div className="bg-emerald-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Panel del Médico</h2>
                <p className="text-emerald-100 text-sm mt-1">
                    Gestión de citas programadas
                </p>
            </div>

            {/* Estadísticas */}
            <div className="bg-slate-50 px-6 py-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{citas.length}</p>
                                <p className="text-slate-600">Solicitudes de hospitalización</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {citas.filter(cita => esCitaHoy(cita.fecha)).length}
                                </p>
                                <p className="text-slate-600">Ingresos programados hoy</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{fechasUnicas.length}</p>
                                <p className="text-slate-600">Días con citas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="filtro-fecha" className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por fecha:
                        </label>
                        <select
                            id="filtro-fecha"
                            value={filtroFecha}
                            onChange={(e) => setFiltroFecha(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Todas las fechas</option>
                            {fechasUnicas.map(fecha => (
                                <option key={fecha} value={fecha}>
                                    {formatearFecha(fecha)} ({contarCitasPorFecha(fecha)} citas)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={cargarCitas}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de citas */}
            <div className="p-6">
                {citasFiltradas.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-slate-900">No hay solicitudes de hospitalización</h3>
                        <p className="mt-1 text-sm text-slate-600">
                            {filtroFecha ? 'No hay solicitudes para la fecha seleccionada.' : 'Las solicitudes de hospitalización aparecerán aquí cuando se registren.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {citasFiltradas.map((cita) => (
                            <div
                                key={cita.id}
                                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${esCitaHoy(cita.fecha) ? 'border-emerald-300 bg-emerald-50' :
                                    esCitaVencida(cita.fecha, cita.hora) ? 'border-red-300 bg-red-50' :
                                        'border-slate-200 bg-white'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {cita.nombrePaciente}
                                            </h3>
                                            {esCitaHoy(cita.fecha) && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    Hoy
                                                </span>
                                            )}
                                            {esCitaVencida(cita.fecha, cita.hora) && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Vencida
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatearFecha(cita.fecha)}</span>
                                            </div>

                                            {cita.hora && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{formatearHora(cita.hora)}</span>
                                                </div>
                                            )}

                                            {cita.telefono && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    <span>{cita.telefono}</span>
                                                </div>
                                            )}

                                            {cita.email && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    <span className="truncate">{cita.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Motivo de consulta:</h4>
                                    <p className="text-sm text-gray-600">{cita.motivo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
