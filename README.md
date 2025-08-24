# 🏥 Sistema de Agenda Hospitalaria

Un sistema web completo desarrollado en **Next.js** que permite a los pacientes agendar citas médicas y a los médicos visualizar y gestionar su programación.

## 🚀 Características Implementadas

### ✅ Funcionalidades Principales

- **Portal del Paciente**: Formulario intuitivo para agendar citas con validaciones completas
- **Portal del Médico**: Panel de gestión para visualizar citas programadas
- **Navegación fluida**: Sistema de rutas con App Router de Next.js
- **Interfaz responsive**: Diseño adaptable para dispositivos móviles y desktop
- **Almacenamiento local**: Datos persistentes usando localStorage (simulando base de datos)

### ✅ Validaciones Implementadas

- **Campos obligatorios**: Nombre, fecha, hora y motivo
- **Horarios de atención**: Lunes a sábado de 8:00 AM a 6:00 PM
- **Fechas válidas**: No permite agendar citas en fechas pasadas ni domingos
- **Formatos**: Validación de email y teléfono con patrones específicos
- **Longitud mínima**: Nombre (2 caracteres) y motivo (5 caracteres)

### ✅ Componentes Desarrollados

- `FormularioCita`: Formulario completo con validaciones y estados
- `ListaPacientes`: Vista del médico con filtros, estadísticas y organización
- `Navigation`: Navegación reutilizable entre secciones
- `InicializadorDatos`: Carga datos de ejemplo automáticamente

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15.4.2 con App Router
- **Lenguaje**: TypeScript para tipado fuerte
- **Estilos**: Tailwind CSS con estilos personalizados
- **Iconos**: SVG personalizados integrados
- **Fuentes**: Geist Sans y Geist Mono
- **Linting**: ESLint con configuración Next.js

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── globals.css        # Estilos globales
│   ├── paciente/
│   │   └── page.tsx       # Portal del paciente
│   └── medico/
│       └── page.tsx       # Portal del médico
├── components/            # Componentes reutilizables
│   ├── FormularioCita.tsx # Formulario de agendamiento
│   ├── ListaPacientes.tsx # Lista y gestión de citas
│   ├── Navigation.tsx     # Navegación principal
│   └── InicializadorDatos.tsx # Inicializador de datos
├── lib/                   # Funciones utilitarias
│   ├── citas.ts          # Gestión de citas (CRUD)
│   ├── validaciones.ts   # Validaciones del formulario
│   └── datosEjemplo.ts   # Datos de demostración
├── types/                 # Definiciones TypeScript
│   └── cita.ts           # Interfaces y tipos
└── styles/                # Estilos personalizados
    └── custom.css        # CSS personalizado
```

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd agenda-hospital
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

### Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificar código con ESLint

## 📱 Uso del Sistema

### Para Pacientes

1. Acceder al **Portal del Paciente** desde la página principal
2. Completar el formulario con:
   - Nombre completo (obligatorio)
   - Fecha de la cita (obligatorio)
   - Hora de la cita (obligatorio, 8:00 AM - 6:00 PM)
   - Motivo de consulta (obligatorio)
   - Teléfono (opcional)
   - Email (opcional)
3. Hacer clic en "Agendar Cita"
4. Recibir confirmación de cita agendada

### Para Médicos

1. Acceder al **Portal del Médico** desde la página principal
2. Ver estadísticas generales:
   - Total de citas programadas
   - Citas del día actual
   - Días con citas programadas
3. Filtrar citas por fecha específica
4. Ver detalles de cada paciente:
   - Información personal y de contacto
   - Motivo de la consulta
   - Fecha y hora de la cita
   - Estado (hoy, vencida, futura)
5. Usar acciones rápidas:
   - Actualizar lista
   - Imprimir agenda
   - Crear nueva cita

## 🎨 Características de Diseño

- **Paleta de colores**: Azul para pacientes, verde para médicos
- **Iconografía consistente**: SVGs personalizados en todo el sistema
- **Estados visuales**: Indicadores para citas de hoy, vencidas y futuras
- **Animaciones suaves**: Transiciones CSS para mejor experiencia
- **Responsive design**: Adaptable a móviles, tablets y desktop

## 🔧 Funcionalidades Técnicas

### Gestión de Estado

- Estados locales con React Hooks
- Persistencia en localStorage
- Validaciones en tiempo real

### Validaciones

- Validación de formularios en el frontend
- Mensajes de error descriptivos
- Prevención de envío con datos inválidos

### Experiencia de Usuario

- Loading states durante procesamiento
- Mensajes de confirmación
- Interfaz intuitiva y accesible

## 🚀 Próximas Mejoras (Futuro)

### Almacenamiento Persistente

- [ ] Integración con MongoDB o Firebase
- [ ] API Routes para operaciones CRUD
- [ ] Sistema de backup automático

### Autenticación

- [ ] Sistema de login/registro
- [ ] Roles diferenciados (paciente/médico)
- [ ] Sesiones seguras

### Funcionalidades Avanzadas

- [ ] Calendario visual interactivo
- [ ] Notificaciones por email/SMS
- [ ] Sistema de recordatorios
- [ ] Historial médico básico
- [ ] Exportación a PDF
- [ ] Dashboard con métricas

### Mejoras UX/UI

- [ ] Modo oscuro
- [ ] Internacionalización
- [ ] Accesibilidad mejorada
- [ ] PWA (Progressive Web App)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
