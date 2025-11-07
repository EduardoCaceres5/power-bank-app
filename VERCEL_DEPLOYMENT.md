# 🚀 Guía de Despliegue del Admin Panel en Vercel

Tu admin panel (React + Vite + Chakra UI) es **perfecto para Vercel**. Aquí está todo lo que necesitas.

## ✅ Por qué Vercel es Ideal para el Frontend

- ✅ **Diseñado para React/Vite**
- ✅ **Deploy automático** desde GitHub
- ✅ **CDN global** ultra-rápido
- ✅ **SSL gratis**
- ✅ **Preview deployments** para cada PR
- ✅ **Plan gratuito generoso**

---

## 🚀 Opción 1: Deploy desde GitHub (Recomendado)

### 1. Subir Código a GitHub

```bash
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin

# Crear .gitignore si no existe
cat > .gitignore << EOF
node_modules
dist
.env
.env.local
*.log
coverage
.DS_Store
EOF

# Git init y push
git init
git add .
git commit -m "Initial commit - Power Bank Admin Panel"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/power-bank-admin.git
git push -u origin main
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"New Project"**
3. Click en **"Import Git Repository"**
4. Selecciona tu repositorio `power-bank-admin`
5. Vercel detectará automáticamente que es un proyecto Vite

### 3. Configurar el Proyecto

Vercel detectará automáticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si necesitas personalizar, usa estos valores exactos.

### 4. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agrega:

```env
# Backend API URL (URL de tu backend en Railway)
VITE_API_URL=https://your-backend.up.railway.app/api/v1

# Application Info
VITE_APP_NAME=Power Bank Admin
VITE_APP_VERSION=1.0.0
```

**IMPORTANTE**: Reemplaza `https://your-backend.up.railway.app` con la URL real de tu backend en Railway.

### 5. Deploy

Click en **"Deploy"** y Vercel:
1. Clonará el repo
2. Instalará dependencias
3. Ejecutará `npm run build`
4. Desplegará el sitio

¡Tu admin panel estará listo en ~2 minutos! 🎉

---

## 🚀 Opción 2: Deploy desde CLI

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin

# Primera vez (modo interactivo)
vercel

# Siguientes deploys
vercel --prod
```

---

## 🔧 Configuración Post-Deploy

### Conectar con el Backend

Tu frontend necesita comunicarse con el backend. Asegúrate de:

#### 1. Configurar CORS en el Backend

En tu backend (Railway), asegúrate de que la variable `CORS_ORIGINS` incluya la URL de Vercel:

```env
# En Railway
CORS_ORIGINS=https://your-admin.vercel.app,https://your-admin-preview.vercel.app
```

O para permitir todos los subdominios de Vercel durante desarrollo:
```env
CORS_ORIGINS=https://*.vercel.app
```

#### 2. Verificar la URL del API

En Vercel → Settings → Environment Variables:
```env
VITE_API_URL=https://your-backend.up.railway.app/api/v1
```

#### 3. Probar la Conexión

Después del deploy, abre la consola del navegador en tu admin panel y verifica:
```javascript
console.log(import.meta.env.VITE_API_URL);
// Debería mostrar: https://your-backend.up.railway.app/api/v1
```

---

## 🌐 Dominio Personalizado

### Agregar tu Propio Dominio

1. Ve a tu proyecto en Vercel → Settings → Domains
2. Click en **"Add Domain"**
3. Ingresa tu dominio (ej: `admin.powerbank.com`)
4. Vercel te dará los DNS records para configurar:

   **Opción A: CNAME (Recomendado)**
   ```
   Type: CNAME
   Name: admin
   Value: cname.vercel-dns.com
   ```

   **Opción B: A Record**
   ```
   Type: A
   Name: admin
   Value: 76.76.21.21
   ```

5. Espera propagación DNS (5-30 minutos)
6. Vercel configurará SSL automáticamente

---

## 🔄 Auto-Deploy

Cada vez que hagas push a GitHub, Vercel desplegará automáticamente:

```bash
# Hacer cambios
git add .
git commit -m "Update dashboard UI"
git push

# Vercel desplegará automáticamente en ~2 minutos
```

### Preview Deployments

Cada Pull Request crea un preview deployment único:
- URL única para cada PR
- Ideal para testing antes de merge
- Se elimina automáticamente al cerrar PR

---

## 🎨 Optimizaciones

### 1. Optimización de Build

Tu `vite.config.ts` ya está bien configurado, pero puedes agregar optimizaciones:

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Reduce tamaño en producción
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
  // ... resto de tu config
});
```

### 2. Lazy Loading de Rutas

En tu `App.tsx` o router:

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Cabinets = lazy(() => import('./pages/Cabinets'));
const Users = lazy(() => import('./pages/Users'));

// En tu router
<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/cabinets" element={<Cabinets />} />
  </Routes>
</Suspense>
```

---

## 🧪 Testing del Deploy

Después del deploy, verifica:

```bash
# Tu URL de Vercel
ADMIN_URL="https://your-admin.vercel.app"

# 1. Verificar que carga
curl $ADMIN_URL

# 2. Verificar assets
curl $ADMIN_URL/assets/index-[hash].js

# 3. Verificar routing (SPA)
curl $ADMIN_URL/dashboard
curl $ADMIN_URL/cabinets
# Todos deberían devolver el mismo index.html
```

Desde el navegador:
1. Abre DevTools → Network
2. Verifica que los assets se cargan desde Vercel CDN
3. Prueba login y navegación
4. Verifica que las llamadas al API funcionan

---

## 📊 Monitoreo

### Analytics

Vercel proporciona analytics gratuitos:
- Page views
- Top pages
- User demographics
- Core Web Vitals

Actívalo en: Project → Analytics

### Performance

Vercel muestra automáticamente:
- Build time
- Build size
- Lighthouse scores
- Core Web Vitals

---

## 🔐 Variables de Entorno por Ambiente

Puedes tener diferentes variables para development, preview, y production:

```bash
# Production
VITE_API_URL=https://api.powerbank.com/api/v1

# Preview (branches y PRs)
VITE_API_URL=https://api-staging.powerbank.com/api/v1

# Development (local)
VITE_API_URL=http://localhost:3000/api/v1
```

Configura en Vercel → Settings → Environment Variables y selecciona el ambiente.

---

## 🚨 Troubleshooting

### Error: "404 on page refresh"

**Causa**: SPA routing no configurado

**Solución**: Ya está configurado en `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Error: "VITE_API_URL is undefined"

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Vercel → Settings → Environment Variables
2. Agrega `VITE_API_URL=https://...`
3. Redeploy

### Error: "CORS error when calling API"

**Causa**: Backend no permite tu dominio de Vercel

**Solución**: En Railway, agrega tu URL de Vercel a `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://your-admin.vercel.app
```

### Error: "Build failed"

**Revisa logs**:
1. Vercel → Deployments → Click en deploy fallido
2. Revisa "Build Logs"

**Errores comunes**:
```bash
# TypeScript errors
npm run build  # Ejecuta local para ver errores

# Dependency issues
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Assets no se cargan (404)

**Causa**: Path incorrecto en build

**Solución**: Verifica `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // Asegúrate que sea '/' no './'
});
```

---

## 💰 Costos

### Plan Hobby (Free) - Perfecto para ti

- ✅ Unlimited deployments
- ✅ 100GB bandwidth/mes
- ✅ Unlimited sites
- ✅ SSL automático
- ✅ Preview deployments
- ✅ CDN global

**Tu admin panel usará ~0-5GB/mes** (bien dentro del free tier)

### Plan Pro ($20/mes) - Solo si necesitas

- Más analytics
- Más bandwidth (1TB)
- Password protection
- Team features

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React on Vercel](https://vercel.com/guides/deploying-react-with-vercel)

---

## 🎯 Checklist de Deployment

- [ ] Código en GitHub
- [ ] `.gitignore` configurado
- [ ] `vercel.json` creado
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Build exitoso
- [ ] CORS configurado en backend
- [ ] Login funciona
- [ ] API calls funcionan
- [ ] Routing funciona (refresh en /dashboard)
- [ ] Dominio personalizado (opcional)

---

## 🚀 Deploy Rápido (TL;DR)

```bash
# 1. Push a GitHub
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin
git add .
git commit -m "Ready for Vercel"
git push

# 2. En Vercel:
- Import from GitHub
- Select repository
- Add env var: VITE_API_URL=https://your-backend.up.railway.app/api/v1
- Deploy

# 3. En Railway (backend):
- Add env var: CORS_ORIGINS=https://your-admin.vercel.app
- Redeploy

# 4. Test
- Open https://your-admin.vercel.app
- Login
- Verify API calls work
```

---

## 🔄 Arquitectura Completa

```
┌─────────────────────────────────────┐
│     Frontend (Vercel)               │
│  React + Vite + Chakra UI           │
│  https://your-admin.vercel.app      │
└──────────────┬──────────────────────┘
               │ HTTPS API Calls
               │
┌──────────────▼──────────────────────┐
│     Backend (Railway)               │
│  Node.js + Express + Prisma         │
│  https://your-api.up.railway.app    │
│  + WebSocket support                │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Database (Railway)              │
│  PostgreSQL                         │
└─────────────────────────────────────┘
```

**Costos totales estimados**:
- Frontend (Vercel): $0/mes (free tier)
- Backend (Railway): $3-5/mes (dentro del $5 free)
- **Total: ~$0-5/mes** 🎉

---

¿Listo para deployar? ¡Solo necesitas hacer push a GitHub y conectar con Vercel! 🚀
