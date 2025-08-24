'use client';

import { useState, useMemo } from 'react';
import { Cita } from '@/types/cita';
import { formatearFecha, formatearHora } from '@/lib/citas';

interface CalendarioMedicoProps {
    citas: Cita[];
    onCitaMovidaAction: (citaId: string, nuevaFecha: string) => void;
}

interface ConfirmacionModal {
    show: boolean;
    cita: Cita | null;
    nuevaFecha: string;
}

function toYMD(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function CalendarioMedico({ citas, onCitaMovidaAction }: CalendarioMedicoProps) {
    const [mesActual, setMesActual] = useState(new Date());
    const [draggedCita, setDraggedCita] = useState<Cita | null>(null);
    const [modalConfirmacion, setModalConfirmacion] = useState<ConfirmacionModal>({
        show: false,
        cita: null,
        nuevaFecha: ''
    });

    // Generar días del mes
    const { diasMes, nombreMes, año } = useMemo(() => {
        const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
        const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0);
        const diasEnMes = ultimoDia.getDate();

        // Calcular día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
        const primerDiaSemana = (primerDia.getDay() + 6) % 7; // Ajustar para que lunes sea 0

        const dias: Array<{ fecha: Date; esMesActual: boolean }> = [];

        // Días del mes anterior
        const mesAnterior = new Date(primerDia);
        mesAnterior.setDate(mesAnterior.getDate() - primerDiaSemana);
        for (let i = 0; i < primerDiaSemana; i++) {
            const fecha = new Date(mesAnterior);
            fecha.setDate(fecha.getDate() + i);
            dias.push({ fecha, esMesActual: false });
        }

        // Días del mes actual
        for (let dia = 1; dia <= diasEnMes; dia++) {
            const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
            dias.push({ fecha, esMesActual: true });
        }

        // Días del mes siguiente para completar la grilla
        const diasRestantes = 42 - dias.length; // 6 semanas × 7 días
        const messiguiente = new Date(ultimoDia);
        messiguiente.setDate(messiguiente.getDate() + 1);
        for (let i = 0; i < diasRestantes; i++) {
            const fecha = new Date(messiguiente);
            fecha.setDate(fecha.getDate() + i);
            dias.push({ fecha, esMesActual: false });
        }

        return {
            diasMes: dias,
            nombreMes: primerDia.toLocaleString('es-ES', { month: 'long' }),
            año: primerDia.getFullYear()
        };
    }, [mesActual]);

    // Agrupar citas por fecha
    const citasPorFecha = useMemo(() => {
        const mapa = new Map<string, Cita[]>();
        citas.forEach(cita => {
            const fecha = cita.fecha;
            if (!mapa.has(fecha)) {
                mapa.set(fecha, []);
            }
            mapa.get(fecha)!.push(cita);
        });
        return mapa;
    }, [citas]);

    const cambiarMes = (delta: number) => {
        setMesActual(prev => {
            const nuevo = new Date(prev);
            nuevo.setMonth(nuevo.getMonth() + delta);
            return nuevo;
        });
    };

    const irAHoy = () => {
        setMesActual(new Date());
    };

    const handleDragStart = (e: React.DragEvent, cita: Cita) => {
        setDraggedCita(cita);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', cita.id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, fecha: Date) => {
        e.preventDefault();

        if (!draggedCita) return;

        const nuevaFecha = toYMD(fecha);
        const hoy = toYMD(new Date());

        // No permitir mover a fechas pasadas
        if (nuevaFecha < hoy) {
            setDraggedCita(null);
            return;
        }

        // Si es la misma fecha, no hacer nada
        if (nuevaFecha === draggedCita.fecha) {
            setDraggedCita(null);
            return;
        }

        // Mostrar modal de confirmación
        setModalConfirmacion({
            show: true,
            cita: draggedCita,
            nuevaFecha
        });

        setDraggedCita(null);
    };

    const confirmarMovimiento = () => {
        if (modalConfirmacion.cita) {
            onCitaMovidaAction(modalConfirmacion.cita.id, modalConfirmacion.nuevaFecha);
        }
        setModalConfirmacion({ show: false, cita: null, nuevaFecha: '' });
    };

    const cancelarMovimiento = () => {
        setModalConfirmacion({ show: false, cita: null, nuevaFecha: '' });
    };

    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    // Obtener todas las citas ordenadas por fecha
    const citasOrdenadas = useMemo(() => {
        return [...citas].sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.hora ?? '00:00'}`);
            const fechaB = new Date(`${b.fecha} ${b.hora ?? '00:00'}`);
            return fechaA.getTime() - fechaB.getTime();
        });
    }, [citas]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Panel lateral con todas las citas */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow border border-slate-200 h-fit sticky top-4">
                    <div className="bg-slate-100 px-4 py-3 rounded-t-lg border-b">
                        <h3 className="font-semibold text-slate-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Citas Programadas
                        </h3>
                        <p className="text-xs text-slate-600 mt-1">
                            Arrastra las tarjetas al calendario
                        </p>
                    </div>
                    <div className="p-4 max-h-96 overflow-y-auto">
                        {citasOrdenadas.length === 0 ? (
                            <div className="text-center py-6">
                                <svg className="w-12 h-12 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-slate-500 text-sm">No hay citas programadas</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {citasOrdenadas.map(cita => {
                                    const esPasado = cita.fecha < toYMD(new Date());
                                    return (
                                        <div
                                            key={`sidebar-${cita.id}`}
                                            draggable={!esPasado}
                                            onDragStart={(e) => handleDragStart(e, cita)}
                                            className={`p-3 rounded-lg border border-l-4 transition-all cursor-grab active:cursor-grabbing ${esPasado
                                                ? 'border-gray-200 border-l-gray-400 bg-gray-50 opacity-60 cursor-not-allowed'
                                                : 'border-blue-200 border-l-blue-500 bg-blue-50 hover:bg-blue-100 hover:shadow-md'
                                                }`}
                                            title={esPasado ? 'No se puede mover - fecha pasada' : 'Arrastra para cambiar fecha'}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-gray-900 truncate text-sm">
                                                        {cita.nombrePaciente}
                                                    </div>
                                                    <div className="text-xs text-slate-600 mt-1">
                                                        {formatearFecha(cita.fecha)}
                                                    </div>
                                                    {cita.hora && (
                                                        <div className="text-xs text-blue-600 font-medium">
                                                            {formatearHora(cita.hora)}
                                                        </div>
                                                    )}
                                                    <div className="text-xs text-slate-500 mt-1 truncate">
                                                        {cita.motivo}
                                                    </div>
                                                </div>
                                                {!esPasado && (
                                                    <div className="flex-shrink-0 ml-2">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendario principal */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow-lg border border-slate-200">
                    {/* Header del calendario */}
                    <div className="bg-emerald-600 px-6 py-4 rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => cambiarMes(-1)}
                                className="p-2 text-white hover:bg-emerald-700 rounded-md transition-colors"
                                aria-label="Mes anterior"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-white capitalize">
                                    {nombreMes} {año}
                                </h2>
                                <button
                                    onClick={irAHoy}
                                    className="mt-1 px-3 py-1 text-xs bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition-colors"
                                >
                                    Ir a hoy
                                </button>
                            </div>

                            <button
                                onClick={() => cambiarMes(1)}
                                className="p-2 text-white hover:bg-emerald-700 rounded-md transition-colors"
                                aria-label="Mes siguiente"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Días de la semana */}
                    <div className="grid grid-cols-7 border-b border-slate-200">
                        {diasSemana.map(dia => (
                            <div key={dia} className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50">
                                {dia}
                            </div>
                        ))}
                    </div>

                    {/* Grilla del calendario */}
                    <div className="grid grid-cols-7">
                        {diasMes.map((diaInfo, index) => {
                            const fechaStr = toYMD(diaInfo.fecha);
                            const citasDelDia = citasPorFecha.get(fechaStr) || [];
                            const esHoy = fechaStr === toYMD(new Date());
                            const esPasado = fechaStr < toYMD(new Date());

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[100px] border-r border-b border-slate-200 p-2 transition-colors ${diaInfo.esMesActual
                                            ? esPasado
                                                ? 'bg-slate-100'
                                                : esHoy
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'bg-white hover:bg-slate-50'
                                            : 'bg-slate-50'
                                        } ${esPasado ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                    onDragOver={!esPasado ? handleDragOver : undefined}
                                    onDrop={!esPasado ? (e) => handleDrop(e, diaInfo.fecha) : undefined}
                                >
                                    <div className={`text-sm font-medium mb-2 ${diaInfo.esMesActual
                                            ? esPasado
                                                ? 'text-slate-400'
                                                : esHoy
                                                    ? 'text-blue-600 font-semibold'
                                                    : 'text-slate-900'
                                            : 'text-slate-400'
                                        }`}>
                                        {diaInfo.fecha.getDate()}
                                        {esHoy && (
                                            <span className="ml-1 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        {citasDelDia.map(cita => (
                                            <div
                                                key={cita.id}
                                                className={`text-xs p-1.5 rounded border-l-2 transition-all ${esPasado
                                                        ? 'bg-slate-100 text-slate-500 border-l-slate-300'
                                                        : 'bg-blue-50 text-blue-700 border-l-blue-400 hover:bg-blue-100'
                                                    }`}
                                                title={`${cita.nombrePaciente} - ${cita.motivo}`}
                                            >
                                                <div className="font-medium truncate">
                                                    {cita.nombrePaciente}
                                                </div>
                                                {cita.hora && (
                                                    <div className={`text-xs ${esPasado ? 'text-slate-400' : 'text-blue-600'}`}>
                                                        {formatearHora(cita.hora)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {!esPasado && citasDelDia.length === 0 && diaInfo.esMesActual && (
                                            <div className="text-xs text-slate-300 text-center py-3 border border-dashed border-slate-200 rounded-md hover:border-blue-300 hover:text-blue-400 transition-colors">
                                                Disponible
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {modalConfirmacion.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirmar cambio de fecha
                        </h3>

                        {modalConfirmacion.cita && (
                            <div className="mb-4">
                                <p className="text-gray-600 mb-2">
                                    ¿Desea mover la cita de <strong>{modalConfirmacion.cita.nombrePaciente}</strong>?
                                </p>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <div className="text-sm">
                                        <div><strong>De:</strong> {formatearFecha(modalConfirmacion.cita.fecha)}</div>
                                        <div><strong>A:</strong> {formatearFecha(modalConfirmacion.nuevaFecha)}</div>
                                        <div className="mt-2 text-gray-600">
                                            <strong>Motivo:</strong> {modalConfirmacion.cita.motivo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelarMovimiento}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarMovimiento}
                                className="px-4 py-2 text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
