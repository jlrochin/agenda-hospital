'use client';

import { useState, useEffect } from 'react';
import { obtenerPacientesDisponibles, PacienteDisponible, eliminarCitasVencidas } from '@/lib/citas';

interface ListaPacientesDisponiblesProps {
    actualizarLista?: number; // Para forzar actualización
}

export default function ListaPacientesDisponibles({ actualizarLista }: ListaPacientesDisponiblesProps) {
    const [pacientesDisponibles, setPacientesDisponibles] = useState<PacienteDisponible[]>([]);
    const [filtroMotivo, setFiltroMotivo] = useState<string>('');
    const [cargando, setCargando] = useState(true);

    const cargarPacientesDisponibles = () => {
        setCargando(true);
        setTimeout(() => {
            // Eliminar citas vencidas antes de cargar
            eliminarCitasVencidas();
            const pacientes = obtenerPacientesDisponibles();
            setPacientesDisponibles(pacientes);
            setCargando(false);
        }, 300); // Simular delay de carga
    };

    useEffect(() => {
        cargarPacientesDisponibles();
    }, [actualizarLista]);

    const pacientesFiltrados = filtroMotivo
        ? pacientesDisponibles.filter(paciente => 
            paciente.motivoConsulta.toLowerCase().includes(filtroMotivo.toLowerCase()))
        : pacientesDisponibles;

    const motivosUnicos = Array.from(new Set(pacientesDisponibles.map(p => p.motivoConsulta))).sort();

    const handleDragStart = (e: React.DragEvent, paciente: PacienteDisponible) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'paciente-disponible',
            paciente: paciente
        }));
        e.dataTransfer.effectAllowed = 'move';
    };

    if (cargando) {
        return (
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-slate-200">
                <div className="bg-emerald-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Pacientes Disponibles</h2>
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
                <h2 className="text-xl font-semibold text-white">Pacientes Disponibles</h2>
                <p className="text-emerald-100 text-sm mt-1">
                    Pacientes sin citas asignadas - Arrastra al calendario para programar
                </p>
            </div>

            {/* Estadísticas */}
            <div className="bg-slate-50 px-6 py-4 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{pacientesDisponibles.length}</p>
                                <p className="text-slate-600">Pacientes sin citas</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-emerald-600 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{pacientesFiltrados.length}</p>
                                <p className="text-slate-600">Mostrados</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                        <div className="flex items-center">
                            <div className="p-2 bg-orange-500 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{motivosUnicos.length}</p>
                                <p className="text-slate-600">Tipos de consulta</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label htmlFor="filtro-motivo" className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por motivo de consulta:
                        </label>
                        <select
                            id="filtro-motivo"
                            value={filtroMotivo}
                            onChange={(e) => setFiltroMotivo(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="">Todos los motivos</option>
                            {motivosUnicos.map(motivo => (
                                <option key={motivo} value={motivo}>
                                    {motivo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Instrucciones */}
            {pacientesDisponibles.length > 0 && (
                <div className="px-6 py-3 bg-blue-50 border-b">
                    <div className="flex items-center text-blue-800">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">
                            Arrastra cualquier tarjeta de paciente al calendario para programar una cita
                        </span>
                    </div>
                </div>
            )}

            {/* Lista de pacientes */}
            <div className="p-6">
                {pacientesFiltrados.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg">
                            {pacientesDisponibles.length === 0 
                                ? 'Todos los pacientes tienen citas asignadas' 
                                : 'No hay pacientes con ese motivo de consulta'}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            {pacientesDisponibles.length === 0 
                                ? 'Cancele alguna cita para que aparezcan pacientes disponibles'
                                : 'Pruebe con otro filtro o vea todos los motivos'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        {pacientesFiltrados.map((paciente) => (
                            <div
                                key={paciente.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, paciente)}
                                className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-move border-l-4 border-l-blue-500 hover:border-l-blue-600"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {paciente.nombre}
                                            </h3>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                </svg>
                                                <span className="font-medium text-emerald-700">{paciente.motivoConsulta}</span>
                                            </div>

                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <span>{paciente.telefono}</span>
                                            </div>

                                            {paciente.email && (
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                    <span>{paciente.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex flex-col items-center text-center">
                                        <div className="p-2 bg-blue-100 rounded-full mb-2">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                            </svg>
                                        </div>
                                        <span className="text-xs text-gray-500 font-medium">Arrastrar</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
