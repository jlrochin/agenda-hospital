'use client';

import { useState, useMemo } from 'react';
import { Cita } from '@/types/cita';
import { crearCitaDesdePaciente, PacienteDisponible } from '@/lib/citas';

interface CalendarioMedicoProps {
    citas: Cita[];
    onCitaMovidaAction: (citaId: string, nuevaFecha: string) => void;
    onCitaCanceladaAction?: (citaId: string, motivoCancelacion: string, reprogramar: boolean) => void;
    onNuevaCitaCreada?: () => void; // Para actualizar la lista cuando se crea una nueva cita
}

interface ConfirmacionModal {
    show: boolean;
    cita: Cita | null;
    nuevaFecha: string;
}

interface ListaPacientesModal {
    show: boolean;
    fecha: string;
    citas: Cita[];
}

interface CancelacionModal {
    show: boolean;
    cita: Cita | null;
    motivoCancelacion: string;
    reprogramar: boolean;
}

function toYMD(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function CalendarioMedico({ 
    citas, 
    onCitaMovidaAction, 
    onCitaCanceladaAction,
    onNuevaCitaCreada 
}: CalendarioMedicoProps) {
    // Inicializar con la fecha actual (agosto 2025)
    const [mesActual, setMesActual] = useState(() => {
        const hoy = new Date();
        console.log('Fecha actual del sistema:', hoy);
        return hoy;
    });
    const [draggedCita, setDraggedCita] = useState<Cita | null>(null);
    const [modalConfirmacion, setModalConfirmacion] = useState<ConfirmacionModal>({
        show: false,
        cita: null,
        nuevaFecha: ''
    });
    const [modalListaPacientes, setModalListaPacientes] = useState<ListaPacientesModal>({
        show: false,
        fecha: '',
        citas: []
    });
    const [modalCancelacion, setModalCancelacion] = useState<CancelacionModal>({
        show: false,
        cita: null,
        motivoCancelacion: '',
        reprogramar: false
    });

    // Generar días del mes (usando la misma lógica que CalendarioGrande)
    const { weeks, monthName, year } = useMemo(() => {
        const base = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
        const month = base.getMonth();

        // Lunes como primer día (ISO): ajustamos para iniciar la grilla en lunes
        const start = new Date(base);
        const day = (base.getDay() + 6) % 7; // 0=lunes
        start.setDate(base.getDate() - day);

        const weeks: Array<Array<Date>> = [];
        const cursor = new Date(start);
        for (let w = 0; w < 6; w++) {
            const week: Date[] = [];
            for (let d = 0; d < 7; d++) {
                week.push(new Date(cursor));
                cursor.setDate(cursor.getDate() + 1);
            }
            weeks.push(week);
            // si ya pasamos el mes y hemos incluido al menos una semana del mes
            if (cursor.getMonth() !== month && cursor.getDate() >= 7) break;
        }

        const monthName = base.toLocaleString("es-ES", { month: "long" });
        const year = base.getFullYear();

        return { weeks, monthName, year };
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

        const nuevaFecha = toYMD(fecha);
        const hoy = toYMD(new Date());

        // No permitir drops en fechas pasadas
        if (nuevaFecha < hoy) {
            setDraggedCita(null);
            return;
        }

        try {
            const data = e.dataTransfer.getData('application/json');
            const dropData = JSON.parse(data);

            if (dropData.type === 'paciente-disponible') {
                // Crear nueva cita desde paciente disponible
                const paciente: PacienteDisponible = dropData.paciente;
                const nuevaCita = crearCitaDesdePaciente(paciente, nuevaFecha);
                
                // Notificar que se creó una nueva cita
                if (onNuevaCitaCreada) {
                    onNuevaCitaCreada();
                }
                
                // Mostrar confirmación
                alert(`Cita creada para ${paciente.nombre} el ${nuevaFecha}`);
                return;
            }

            // Si es una cita existente (drag desde tarjetas del calendario)
            if (!draggedCita) return;

            // Debug: verificar las fechas
            console.log('Fecha original cita:', draggedCita.fecha);
            console.log('Nueva fecha (drop):', nuevaFecha);
            console.log('Fecha objeto completo:', fecha);

            if (nuevaFecha === draggedCita.fecha) {
                setDraggedCita(null);
                return;
            }

            setModalConfirmacion({
                show: true,
                cita: draggedCita,
                nuevaFecha
            });

            setDraggedCita(null);
        } catch (error) {
            console.error('Error al procesar drop:', error);
            setDraggedCita(null);
        }
    }; const confirmarMovimiento = () => {
        if (modalConfirmacion.cita) {
            onCitaMovidaAction(modalConfirmacion.cita.id, modalConfirmacion.nuevaFecha);
        }
        setModalConfirmacion({ show: false, cita: null, nuevaFecha: '' });
    };

    const cancelarMovimiento = () => {
        setModalConfirmacion({ show: false, cita: null, nuevaFecha: '' });
    };

    const abrirListaPacientes = (fecha: string, citasDelDia: Cita[]) => {
        // Ordenar citas por hora
        const citasOrdenadas = [...citasDelDia].sort((a, b) => {
            const horaA = a.hora || '00:00';
            const horaB = b.hora || '00:00';
            return horaA.localeCompare(horaB);
        });

        setModalListaPacientes({
            show: true,
            fecha,
            citas: citasOrdenadas
        });
    };

    const cerrarListaPacientes = () => {
        setModalListaPacientes({ show: false, fecha: '', citas: [] });
    };

    const abrirModalCancelacion = (cita: Cita) => {
        setModalCancelacion({
            show: true,
            cita,
            motivoCancelacion: '',
            reprogramar: false
        });
    };

    const cerrarModalCancelacion = () => {
        setModalCancelacion({ show: false, cita: null, motivoCancelacion: '', reprogramar: false });
    };

    const confirmarCancelacion = () => {
        if (modalCancelacion.cita && modalCancelacion.motivoCancelacion.trim() && onCitaCanceladaAction) {
            onCitaCanceladaAction(modalCancelacion.cita.id, modalCancelacion.motivoCancelacion, modalCancelacion.reprogramar);
            cerrarModalCancelacion();
        }
    };

    const isDisabled = (date: Date) => {
        const ymd = toYMD(date);
        const hoy = toYMD(new Date());
        return ymd < hoy;
    };

    const isCurrentMonth = (date: Date) =>
        date.getMonth() === mesActual.getMonth() && date.getFullYear() === mesActual.getFullYear();

    const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

    // Obtener todas las citas ordenadas por fecha
    const citasOrdenadas = useMemo(() => {
        return [...citas].sort((a, b) => {
            const fechaA = new Date(`${a.fecha} ${a.hora ?? '00:00'}`);
            const fechaB = new Date(`${b.fecha} ${b.hora ?? '00:00'}`);
            return fechaA.getTime() - fechaB.getTime();
        });
    }, [citas]);

    const formatearFecha = (fecha: string): string => {
        // Crear fecha en zona horaria local para evitar problemas de UTC
        const [year, month, day] = fecha.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month - 1 porque los meses son 0-indexados

        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatearHora = (hora: string): string => {
        if (!hora) return '';
        const [horas, minutos] = hora.split(':');
        const date = new Date();
        date.setHours(parseInt(horas), parseInt(minutos));
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                                                <div className="flex-shrink-0 ml-2 flex flex-col gap-1">
                                                    {!esPasado && (
                                                        <>
                                                            {/* Botón de cancelación */}
                                                            {onCitaCanceladaAction && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        abrirModalCancelacion(cita);
                                                                    }}
                                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                                    title="Cancelar cita"
                                                                    aria-label="Cancelar cita"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                            {/* Ícono de arrastrar */}
                                                            <div className="p-1">
                                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                                                </svg>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Calendario principal - mismo estilo que CalendarioGrande */}
            <div className="lg:col-span-3">
                <section aria-label="Calendario médico" className="w-full max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={() => cambiarMes(-1)}
                            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Mes anterior"
                        >
                            ←
                        </button>
                        <div className="flex flex-col items-center gap-2">
                            <h2 className="text-lg font-semibold text-slate-900 capitalize">
                                {monthName} {year}
                            </h2>
                            <button
                                type="button"
                                onClick={irAHoy}
                                className="inline-flex items-center rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                                aria-label="Ir al día de hoy"
                            >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Hoy
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => cambiarMes(1)}
                            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Mes siguiente"
                        >
                            →
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-500">
                        {weekdayLabels.map((w) => (
                            <div key={w} className="py-2">
                                {w}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Días del mes">
                        {weeks.map((week, wi) =>
                            week.map((date, di) => {
                                const ymd = toYMD(date);
                                const disabled = isDisabled(date);
                                const inMonth = isCurrentMonth(date);
                                const esHoy = ymd === toYMD(new Date());
                                const citasDelDia = citasPorFecha.get(ymd) || [];

                                return (
                                    <button
                                        key={`${wi}-${di}`}
                                        type="button"
                                        disabled={disabled}
                                        onDragOver={!disabled ? handleDragOver : undefined}
                                        onDrop={!disabled ? (e) => handleDrop(e, date) : undefined}
                                        onClick={citasDelDia.length > 0 && !disabled ? () => abrirListaPacientes(ymd, citasDelDia) : undefined}
                                        aria-label={date.toLocaleDateString("es-ES", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        className={[
                                            "h-16 w-full rounded-lg border text-base font-medium transition-all relative",
                                            "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            inMonth ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 text-slate-400",
                                            disabled ? "text-slate-300 cursor-not-allowed opacity-60" : "hover:bg-slate-50",
                                            esHoy ? "!bg-blue-600 !text-white !border-blue-600" : "",
                                            citasDelDia.length > 0 && !disabled ? "cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm" : "",
                                        ].join(" ")}
                                    >
                                        <div className="absolute top-2 left-2 text-sm font-medium">
                                            {date.getDate()}
                                        </div>

                                        {/* Indicador de citas */}
                                        {citasDelDia.length > 0 && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                <div className="flex space-x-0.5">
                                                    {citasDelDia.slice(0, 3).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-1.5 h-1.5 rounded-full ${esHoy
                                                                ? 'bg-white'
                                                                : disabled
                                                                    ? 'bg-slate-400'
                                                                    : 'bg-blue-500'
                                                                }`}
                                                        />
                                                    ))}
                                                    {citasDelDia.length > 3 && (
                                                        <div className={`text-xs ${esHoy ? 'text-white' : 'text-slate-600'}`}>
                                                            +{citasDelDia.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </section>
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

            {/* Modal de lista de pacientes del día */}
            {modalListaPacientes.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pacientes del {formatearFecha(modalListaPacientes.fecha)}
                            </h3>
                            <button
                                onClick={cerrarListaPacientes}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="Cerrar"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {modalListaPacientes.citas.map((cita, index) => (
                                <div
                                    key={cita.id}
                                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 text-lg">
                                                {cita.nombrePaciente}
                                            </h4>
                                            {cita.hora && (
                                                <p className="text-sm text-emerald-600 font-medium">
                                                    🕒 {cita.hora}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Motivo:</strong> {cita.motivo}
                                        </p>
                                        {cita.telefono && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                <strong>Teléfono:</strong> {cita.telefono}
                                            </p>
                                        )}
                                        {cita.email && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                <strong>Email:</strong> {cita.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Total: {modalListaPacientes.citas.length} {modalListaPacientes.citas.length === 1 ? 'cita' : 'citas'}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={cerrarListaPacientes}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de cancelación de cita */}
            {modalCancelacion.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Cancelar Cita
                        </h3>

                        {modalCancelacion.cita && (
                            <div className="mb-4">
                                <div className="bg-orange-50 p-3 rounded-md border border-orange-200 mb-4">
                                    <p className="text-orange-800 text-sm mb-2">
                                        <strong>Paciente:</strong> {modalCancelacion.cita.nombrePaciente}
                                    </p>
                                    <p className="text-orange-700 text-sm mb-1">
                                        <strong>Fecha:</strong> {formatearFecha(modalCancelacion.cita.fecha)}
                                    </p>
                                    {modalCancelacion.cita.hora && (
                                        <p className="text-orange-700 text-sm mb-1">
                                            <strong>Hora:</strong> {modalCancelacion.cita.hora}
                                        </p>
                                    )}
                                    <p className="text-orange-700 text-sm">
                                        <strong>Motivo:</strong> {modalCancelacion.cita.motivo}
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="motivoCancelacion" className="block text-sm font-medium text-gray-700 mb-2">
                                        Motivo de la cancelación *
                                    </label>
                                    <textarea
                                        id="motivoCancelacion"
                                        rows={3}
                                        value={modalCancelacion.motivoCancelacion}
                                        onChange={(e) => setModalCancelacion(prev => ({
                                            ...prev,
                                            motivoCancelacion: e.target.value
                                        }))}
                                        placeholder="Indique el motivo por el cual cancela esta cita..."
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={modalCancelacion.reprogramar}
                                            onChange={(e) => setModalCancelacion(prev => ({
                                                ...prev,
                                                reprogramar: e.target.checked
                                            }))}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Ofrecer reprogramación al paciente
                                        </span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1 ml-6">
                                        {modalCancelacion.reprogramar
                                            ? "El paciente será contactado para reprogramar la cita"
                                            : "La cita será cancelada definitivamente"
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cerrarModalCancelacion}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarCancelacion}
                                disabled={!modalCancelacion.motivoCancelacion.trim()}
                                className={[
                                    "px-4 py-2 text-white rounded-md transition-colors",
                                    modalCancelacion.motivoCancelacion.trim()
                                        ? modalCancelacion.reprogramar
                                            ? "bg-blue-600 hover:bg-blue-700"
                                            : "bg-orange-600 hover:bg-orange-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                ].join(" ")}
                            >
                                {modalCancelacion.reprogramar ? "Cancelar y Reprogramar" : "Confirmar Cancelación"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
