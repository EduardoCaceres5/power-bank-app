# Quick Start Guide

## Instalación Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Verificar configuración

El archivo `.env` ya está configurado. Verifica que la URL del backend sea correcta:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## Requisitos Previos

- Node.js 18+ instalado
- Backend corriendo en http://localhost:3000
- Backend configurado con credenciales de WsCharge en .env

## Funcionalidades Principales

### ✅ Implementado

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de gabinetes (CRUD)
- ✅ Monitoreo de baterías con niveles de carga
- ✅ Gestión de materiales publicitarios
- ✅ Gestión de grupos publicitarios
- ✅ Gestión de planes publicitarios
- ✅ Configuración del sistema
- ✅ Interfaz responsiva con Chakra UI
- ✅ Navegación con React Router
- ✅ TypeScript para tipado seguro
- ✅ Integración completa con API del backend

### 🚧 Para Mejorar (Opcional)

- Autenticación de usuarios
- Gráficas de uso histórico
- Notificaciones push en tiempo real
- Exportar reportes a PDF/Excel
- Mapa con ubicación de gabinetes
- Logs de actividad del sistema

## Estructura de Navegación

```
Admin Dashboard
├── Dashboard          → Estadísticas generales
├── Cabinets          → Gestión de gabinetes
├── Batteries         → Monitoreo de baterías
├── Screen Management
│   ├── Materials     → Materiales publicitarios
│   ├── Groups        → Grupos de materiales
│   └── Plans         → Planes/Campañas
└── Settings          → Configuración del sistema
```

## Uso Típico

### Agregar un Nuevo Gabinete

1. Ve a "Cabinets"
2. Click "Add Cabinet"
3. Llena los campos:
   - Cabinet ID: ID único (ej: CT123456789)
   - QR Code: Código QR del gabinete
   - Model: PM8, PM12 o PM20
   - SIM: Número de tarjeta SIM (opcional)
4. Click "Add Cabinet"

### Crear una Campaña Publicitaria

1. Ve a "Screen > Materials" y sube imágenes/videos
2. Ve a "Screen > Groups" y agrupa los materiales
3. Ve a "Screen > Plans" y crea una campaña:
   - Define fechas de inicio/fin
   - Asigna horarios y grupos
   - Selecciona gabinetes

## Solución de Problemas

### No se cargan los datos

```bash
# Verifica que el backend esté corriendo
cd ../backend
npm run dev
```

### Error de CORS

Verifica que el backend permita `http://localhost:5173` en CORS.

### Puerto ocupado

Si el puerto 5173 está ocupado, Vite usará el siguiente disponible (5174, 5175, etc).

## Comandos Útiles

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # Linter
npm run format   # Formatear código
```

## Próximos Pasos

1. Personaliza el tema en `src/theme.ts`
2. Agrega nuevas funcionalidades según necesites
3. Conecta con tu base de datos real
4. Implementa autenticación si es necesario
5. Deploy en producción (Vercel, Netlify, etc.)

---

**¡Listo para usar!** 🚀
