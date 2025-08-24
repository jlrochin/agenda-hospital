export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                        © {new Date().getFullYear()} Hospital Agenda — Sistema de Citas de Hospitalización
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a className="hover:text-slate-700" href="#" aria-label="Política de Privacidad">
                            Privacidad
                        </a>
                        <a className="hover:text-slate-700" href="#" aria-label="Términos y Condiciones">
                            Términos
                        </a>
                        <a className="hover:text-slate-700" href="#" aria-label="Soporte">
                            Soporte
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
