"use client";

import { useMemo } from "react";

export interface CalendarioGrandeProps {
    value?: string; // yyyy-mm-dd
    onDateChangeAction: (fecha: string) => void;
    minDate?: string; // yyyy-mm-dd
    disableSundays?: boolean;
}

function toYMD(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export default function CalendarioGrande({
    value,
    onDateChangeAction,
    minDate,
    disableSundays = true,
}: CalendarioGrandeProps) {
    const todayYMD = useMemo(() => toYMD(new Date()), []);
    const selected = value ?? todayYMD;
    const selectedDate = new Date(selected);

    // Construye matriz de semanas para el mes actual basado en la fecha seleccionada
    const { weeks, monthName, year } = useMemo(() => {
        const base = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
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
    }, [selected, selectedDate]);

    const isDisabled = (date: Date) => {
        const ymd = toYMD(date);
        if (minDate && ymd < minDate) return true;
        if (disableSundays && date.getDay() === 0) return true;
        return false;
    };

    const isCurrentMonth = (date: Date) =>
        date.getMonth() === selectedDate.getMonth();

    const changeMonth = (delta: number) => {
        const next = new Date(selectedDate);
        next.setMonth(next.getMonth() + delta);
        // mantener día si es posible
        onDateChangeAction(toYMD(next));
    };

    const handleSelect = (date: Date) => {
        if (isDisabled(date)) return;
        onDateChangeAction(toYMD(date));
    };

    const weekdayLabels = ["L", "M", "X", "J", "V", "S", "D"];

    return (
        <section aria-label="Selector de fecha" className="w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
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
                        onClick={() => onDateChangeAction(todayYMD)}
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
                    onClick={() => changeMonth(1)}
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

            <div className="grid grid-cols-7 gap-2" role="grid" aria-label="Días del mes">
                {weeks.map((week, wi) =>
                    week.map((date, di) => {
                        const ymd = toYMD(date);
                        const disabled = isDisabled(date);
                        const isSelected = ymd === selected;
                        const inMonth = isCurrentMonth(date);
                        return (
                            <button
                                key={`${wi}-${di}`}
                                type="button"
                                onClick={() => handleSelect(date)}
                                disabled={disabled}
                                aria-pressed={isSelected}
                                aria-label={date.toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                                className={[
                                    "h-16 w-full rounded-lg border text-base font-medium transition-colors",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500",
                                    inMonth ? "bg-white border-slate-200" : "bg-slate-50 border-slate-200 text-slate-400",
                                    disabled ? "text-slate-300 cursor-not-allowed opacity-60" : "hover:bg-slate-50",
                                    isSelected ? "!bg-blue-600 !text-white !border-blue-600" : "",
                                ].join(" ")}
                            >
                                {date.getDate()}
                            </button>
                        );
                    })
                )}
            </div>
        </section>
    );
}
