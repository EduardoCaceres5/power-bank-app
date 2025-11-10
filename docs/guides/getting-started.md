# Guía de Inicio Rápido - Power Bank Admin

Esta guía te ayudará a configurar y ejecutar el panel de administración desde cero.

---

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Backend corriendo en http://localhost:3000
- PostgreSQL corriendo
- Backend configurado con credenciales de WsCharge en .env

---

## ⚡ Instalación Rápida

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Ejecutar el proyecto

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

---

## 🔧 Configuración del Backend

### Variables de Entorno del Backend

Verifica que tu archivo `.env` en el backend tenga:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/powerbank_db"

# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Iniciar el Backend

```bash
cd ../backend
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm run dev
```

El servidor debería estar corriendo en: `http://localhost:3000`

---

## 👤 Crear Usuario Administrador

Para acceder al panel, necesitas un usuario con rol `ADMIN` o `SUPER_ADMIN`.

### Opción 1: Usando Prisma Studio

```bash
cd ../backend
pnpm prisma studio
```

1. Ve a la tabla `User`
2. Crea un nuevo usuario:
   - email: `admin@powerbank.com`
   - password: (genera un hash bcrypt)
   - role: `SUPER_ADMIN`
   - isActive: `true`
   - emailVerified: `true`

### Opción 2: Script SQL Directo

```sql
INSERT INTO "User" (
  id,
  email,
  password,
  role,
  "isActive",
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@powerbank.com',
  '$2b$10$YourBcryptHashHere',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
);
```

---

## 🔐 Iniciar Sesión

1. Abre el frontend: `http://localhost:5173`
2. Ve a la página de login
3. Ingresa las credenciales:
   - Email: `admin@powerbank.com`
   - Password: (la que configuraste)

---

## 📊 Poblar la Base de Datos

Para que las visualizaciones muestren información, necesitas datos de prueba.

Ver la guía completa de configuración en [docs/guides/setup-database.md](setup-database.md)

---

## ✅ Verificación

### Verificar que todo funciona:

1. ✅ Backend corriendo en `http://localhost:3000`
2. ✅ Frontend corriendo en `http://localhost:5173`
3. ✅ Puedes iniciar sesión
4. ✅ Dashboard muestra estadísticas
5. ✅ Puedes ver gabinetes, baterías y planes

---

## 🎯 Funcionalidades Principales

### ✅ Implementado

- Dashboard con estadísticas en tiempo real
- Gestión completa de gabinetes (CRUD)
- Monitoreo de baterías con niveles de carga
- Gestión de materiales publicitarios
- Gestión de grupos publicitarios
- Gestión de planes publicitarios
- Configuración del sistema
- Interfaz responsiva con Chakra UI
- Navegación con React Router
- TypeScript para tipado seguro
- Integración completa con API del backend

---

## 🚧 Solución de Problemas

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

---

## 📚 Comandos Útiles

```bash
npm run dev      # Desarrollo
npm run build    # Build producción
npm run preview  # Preview build
npm run lint     # Linter
npm run format   # Formatear código
```

---

## 📖 Documentación Adicional

- [Configuración de Base de Datos](setup-database.md)
- [Guía de Colores y Tema](theme-colors.md)
- [Deployment en Vercel](../deployment/vercel.md)

---

**¡Listo para usar!** 🚀
