export default function Footer() {
    return (
        <footer className="mt-16 border-t border-slate-200 bg-white">
            {/* Leyenda de prototipo */}
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-blue-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-blue-800">
                                🧪 PROTOTIPO DE DEMOSTRACIÓN
                            </span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-blue-600 ml-2">
                            — Sistema en desarrollo para fines educativos y de demostración
                        </span>
                    </div>
                </div>
            </div>
            
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
