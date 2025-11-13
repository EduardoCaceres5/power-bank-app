# Power Bank Admin Dashboard

Admin dashboard para gestionar el sistema de Power Banks con integración WsCharge.

## Tecnologías Utilizadas

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Chakra UI** - Librería de componentes
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas
- **Recharts** - Gráficos y visualizaciones

## Características

### 📊 Dashboard
- Estadísticas en tiempo real
- Total de gabinetes y estado online/offline
- Monitoreo de baterías
- Planes de publicidad activos

### 🏪 Gestión de Gabinetes
- Listar todos los gabinetes
- Agregar nuevos gabinetes (PM8, PM12, PM20)
- Editar información de gabinetes
- Eliminar gabinetes
- Reiniciar gabinetes remotamente
- Abrir slots individuales o todos
- Ver detalles en tiempo real

### 🔋 Monitoreo de Baterías
- Lista completa de baterías
- Nivel de carga en tiempo real
- Estado (disponible, en uso)
- Ubicación en gabinete y slot

### 📺 Gestión de Publicidad en Pantallas

#### Materiales
- Agregar materiales (imágenes/videos)
- Visualizar preview
- Eliminar materiales

#### Grupos
- Crear grupos de materiales
- Definir orden y duración
- Editar y eliminar grupos

#### Planes
- Crear campañas publicitarias
- Definir fechas de inicio/fin
- Asignar horarios y grupos
- Seleccionar gabinetes objetivo

### ⚙️ Configuración del Sistema
- Configurar poder mínimo de batería
- Configurar webhooks
- Personalizar códigos QR
- Imágenes por defecto de pantallas

## 📖 Documentación

Para más información detallada, consulta la documentación en la carpeta [docs/](docs/):

### Guías
- [**Inicio Rápido**](docs/guides/getting-started.md) - Guía para comenzar rápidamente
- [**Configuración de Base de Datos**](docs/guides/setup-database.md) - Scripts SQL para poblar datos
- [**Guía de Colores y Tema**](docs/guides/theme-colors.md) - Paleta de colores y personalización

### Deployment
- [**Deploy en Vercel**](docs/deployment/vercel.md) - Guía completa de despliegue con pnpm

### Diseño
- [**Uso del Logo**](docs/design/logo-usage.md) - Guía de uso del logo
- [**Diseño de Login**](docs/design/login-design.md) - Especificaciones del diseño de login

### Changelog
- Ver [docs/changelog/](docs/changelog/) para historial de cambios e implementaciones

---

## Instalación

### 1. Instalar dependencias

```bash
cd admin
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Power Bank Admin
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEVICE_REGISTRATION=false
```

#### Variables de Entorno Disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL del backend API | `http://localhost:3000/api/v1` |
| `VITE_APP_NAME` | Nombre de la aplicación | `Power Bank Admin` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |
| `VITE_ENABLE_DEVICE_REGISTRATION` | Habilita el registro manual de dispositivos | `false` |

#### Feature Flags

**`VITE_ENABLE_DEVICE_REGISTRATION`**

Esta variable controla la visibilidad de la funcionalidad de registro de dispositivos:

- **`false` (recomendado)**: Oculta la funcionalidad de registro de dispositivo. Usar cuando la API externa (WsCharge) ya maneja los heartbeats y la autenticación de dispositivos.
- **`true`**: Muestra la funcionalidad de registro de dispositivo. Usar solo si planeas implementar tu propio sistema de heartbeats y autenticación de dispositivos.

**¿Cuándo usar cada opción?**

- **API Externa maneja heartbeats** → `VITE_ENABLE_DEVICE_REGISTRATION=false`
  - Los dispositivos físicos ya están configurados con la API externa
  - No necesitas registrar credenciales manualmente
  - La columna "Dispositivo" mostrará "Gestionado externamente"

- **Implementación propia de heartbeats** → `VITE_ENABLE_DEVICE_REGISTRATION=true`
  - Estás desarrollando tu propio sistema de autenticación de dispositivos
  - Necesitas registrar `deviceId` y `deviceSecret` para cada gabinete
  - Los dispositivos físicos usarán JWT tokens para autenticarse

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

El dashboard estará disponible en `http://localhost:5173`

### 4. Build para producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

### 5. Preview de producción

```bash
npm run preview
```

## Estructura del Proyecto

```
admin/
├── docs/                # 📚 Documentación
│   ├── guides/          # Guías de uso
│   │   ├── getting-started.md
│   │   ├── setup-database.md
│   │   └── theme-colors.md
│   ├── deployment/      # Guías de deployment
│   │   └── vercel.md
│   ├── design/          # Documentación de diseño
│   │   ├── logo-usage.md
│   │   └── login-design.md
│   └── changelog/       # Historial de cambios
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── layout/      # Layout (Sidebar, Header)
│   │   ├── cabinets/    # Componentes de gabinetes
│   │   ├── charts/      # Gráficos y visualizaciones
│   │   ├── common/      # Componentes comunes
│   │   └── auth/        # Componentes de autenticación
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Cabinets.tsx
│   │   ├── Batteries.tsx
│   │   ├── ScreenMaterials.tsx
│   │   ├── ScreenGroups.tsx
│   │   ├── ScreenPlans.tsx
│   │   └── Settings.tsx
│   ├── services/        # Servicios API
│   ├── types/           # Definiciones TypeScript
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React Context providers
│   ├── theme/           # Configuración de tema
│   ├── App.tsx          # Componente raíz
│   └── main.tsx         # Punto de entrada
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json          # Configuración de Vercel
└── README.md
```

## Uso

### Dashboard Principal

Al iniciar la aplicación, verás el dashboard principal con:
- Total de gabinetes y cuántos están online
- Total de baterías y disponibles
- Número de planes publicitarios activos
- Estado general del sistema

### Gestionar Gabinetes

1. Click en "Cabinets" en el sidebar
2. Usa los filtros para buscar por ID o estado
3. Click en "Add Cabinet" para agregar uno nuevo
4. Usa el menú de acciones (⋮) para editar, reiniciar o eliminar

### Monitorear Baterías

1. Click en "Batteries" en el sidebar
2. Visualiza el nivel de carga de cada batería
3. Filtra por ID de batería
4. Colores indican el nivel de carga:
   - 🟢 Verde: > 80%
   - 🟡 Amarillo: 50-80%
   - 🟠 Naranja: 20-50%
   - 🔴 Rojo: < 20%

### Gestionar Publicidad

#### Crear Material
1. Ve a "Screen > Materials"
2. Click "Add Material"
3. Sube imagen o video
4. Asigna un nombre

#### Crear Grupo
1. Ve a "Screen > Groups"
2. Click "Add Group"
3. Selecciona materiales
4. Define orden y duración de cada uno

#### Crear Plan
1. Ve a "Screen > Plans"
2. Click "Add Plan"
3. Define fechas de inicio y fin
4. Asigna horarios y grupos
5. Selecciona gabinetes objetivo

## API Backend

El admin se conecta al backend de Power Bank. Asegúrate de que el backend esté corriendo en `http://localhost:3000`.

### Endpoints utilizados

- `GET /api/v1/wscharge/cabinets` - Lista de gabinetes
- `POST /api/v1/wscharge/cabinets` - Crear gabinete
- `PUT /api/v1/wscharge/cabinets/:id` - Actualizar gabinete
- `DELETE /api/v1/wscharge/cabinets/:id` - Eliminar gabinete
- `GET /api/v1/wscharge/batteries` - Lista de baterías
- `GET /api/v1/wscharge/screen/materials` - Materiales publicitarios
- `GET /api/v1/wscharge/screen/groups` - Grupos publicitarios
- `GET /api/v1/wscharge/screen/plans` - Planes publicitarios
- `GET /api/v1/wscharge/settings/*` - Configuraciones

Ver la [documentación del backend](../backend/WSCHARGE_API.md) para más detalles.

## Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview de build
npm run lint       # Ejecutar linter
npm run format     # Formatear código con Prettier
```

## Personalización

### Tema

Edita `src/theme.ts` para cambiar colores, fuentes, etc:

```typescript
const theme = extendTheme({
  colors: {
    brand: {
      500: '#2196f3', // Color principal
    },
  },
});
```

### Rutas

Agrega nuevas rutas en `src/App.tsx`:

```typescript
<Route path="/nueva-pagina" element={<NuevaPagina />} />
```

### API URL

Cambia la URL del backend en `.env`:

```env
VITE_API_URL=https://tu-backend.com/api/v1
```

## Troubleshooting

### El dashboard no carga datos

1. Verifica que el backend esté corriendo
2. Verifica la URL en `.env`
3. Abre la consola del navegador para ver errores

### Error de CORS

Asegúrate de que el backend tenga CORS configurado para permitir `http://localhost:5173`.

En el backend (`backend/src/config/cors.ts`):

```typescript
const allowedOrigins = [
  'http://localhost:5173', // Admin dashboard
];
```

### Errores de TypeScript

Ejecuta:

```bash
npm run build
```

Para ver todos los errores de tipo.

## Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

MIT
