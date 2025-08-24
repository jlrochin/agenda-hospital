import Link from "next/link";

interface NavigationProps {
    currentPage?: "home" | "paciente" | "medico";
}

export default function Navigation({ currentPage = "home" }: NavigationProps) {
    const getNavItemClass = (page: string) => {
        const baseClass =
            "px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none";
        const activeClass = "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200";
        const inactiveClass = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";

        return currentPage === page
            ? `${baseClass} ${activeClass}`
            : `${baseClass} ${inactiveClass}`;
    };

    return (
        <nav className="flex items-center gap-1">
            <Link href="/" className={getNavItemClass("home")}>
                Inicio
            </Link>
            <Link href="/paciente" className={getNavItemClass("paciente")}>
                Pacientes
            </Link>
            <Link href="/medico" className={getNavItemClass("medico")}>
                Médicos
            </Link>
        </nav>
    );
}
