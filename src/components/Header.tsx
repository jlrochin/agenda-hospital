"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md overflow-hidden shadow-sm ring-1 ring-slate-200">
                            <img src="/logo-hospital.svg" alt="Hospital Agenda" className="h-9 w-9" />
                        </span>
                        <div className="leading-tight">
                            <span className="block text-sm text-slate-500">Hospital Agenda</span>
                            <span className="block text-base font-semibold text-slate-900">
                                Sistema de Hospitalización
                            </span>
                        </div>
                    </Link>

                    {(() => {
                        let currentPage: "home" | "paciente" | "medico" = "home";
                        if (pathname?.startsWith("/paciente")) currentPage = "paciente";
                        if (pathname?.startsWith("/medico")) currentPage = "medico";
                        return <Navigation currentPage={currentPage} />;
                    })()}
                </div>
            </div>
        </header>
    );
}
