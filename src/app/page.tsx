import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50/60 to-emerald-50/60">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Plataforma hospitalaria
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
            Agenda de Citas de Hospitalización
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-slate-600">
            Pacientes y personal médico gestionan ingresos y programación con una interfaz clara, segura y profesional.
          </p>
        </div>

        {/* Accesos directos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Card Paciente */}
          <Link
            href="/paciente"
            className="group relative bg-white p-8 focus-within:ring-2 focus-within:ring-blue-400 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-slate-200"
          >
            <div>
              <span className="rounded-xl inline-flex p-4 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 ring-4 ring-white">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                Solicitar Hospitalización
                <span className="absolute inset-0" aria-hidden="true" />
              </h2>
              <p className="mt-3 text-slate-600 text-lg leading-relaxed">
                Programa tu cita para hospitalización de forma segura y organizada.
                Completa el formulario con tus datos médicos y selecciona la fecha
                que mejor se ajuste a tu tratamiento.
              </p>
              <div className="mt-6 inline-flex items-center text-blue-700 group-hover:text-blue-800 font-semibold">
                <span className="text-lg">Programar Cita</span>
                <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Card Personal Médico */}
          <Link
            href="/medico"
            className="group relative bg-white p-8 focus-within:ring-2 focus-within:ring-emerald-400 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border border-slate-200"
          >
            <div>
              <span className="rounded-xl inline-flex p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 ring-4 ring-white">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Panel de Hospitalización
                <span className="absolute inset-0" aria-hidden="true" />
              </h2>
              <p className="mt-3 text-slate-600 text-lg leading-relaxed">
                Administra las citas de hospitalización, consulta información de pacientes
                y gestiona la ocupación hospitalaria. Panel completo de gestión médica.
              </p>
              <div className="mt-6 inline-flex items-center text-emerald-700 group-hover:text-emerald-800 font-semibold">
                <span className="text-lg">Acceder al Panel</span>
                <svg className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Sección de características */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Características del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                  <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Agendamiento Especializado</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Formulario específico para hospitalización con validaciones médicas
                y selección de fechas optimizada para ingresos hospitalarios.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Gestión Hospitalaria</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Panel administrativo completo para el personal médico con estadísticas
                de ocupación y gestión eficiente de citas de hospitalización.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <svg className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Monitoreo en Tiempo Real</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Visualización instantánea de disponibilidad hospitalaria,
                seguimiento de citas programadas y alertas de ocupación.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
