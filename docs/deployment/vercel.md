# Guía Completa de Despliegue en Vercel

Tu admin panel (React + Vite + Chakra UI + pnpm) es perfecto para Vercel. Esta guía cubre todo lo que necesitas.

---

## ✅ Por qué Vercel es Ideal

- Diseñado para React/Vite
- Deploy automático desde GitHub
- CDN global ultra-rápido
- SSL gratis
- Preview deployments para cada PR
- Plan gratuito generoso
- Soporte nativo para pnpm

---

## 🚀 Despliegue desde GitHub (Recomendado)

### 1. Preparar el Repositorio

```bash
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin

# Verificar que estén estos archivos
ls pnpm-lock.yaml    # ✅ Debe existir
ls vercel.json       # ✅ Debe existir

# Push a GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en **"New Project"**
3. Click en **"Import Git Repository"**
4. Selecciona tu repositorio `power-bank-admin`

Vercel detectará automáticamente:
- **Package Manager**: pnpm
- **Framework**: Vite
- **Build Command**: `pnpm run build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 3. Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables, agrega:

```env
# Backend API URL (URL de tu backend en Railway)
VITE_API_URL=https://your-backend.up.railway.app/api/v1

# Application Info
VITE_APP_NAME=Power Bank Admin
VITE_APP_VERSION=1.0.0
```

**IMPORTANTE**: Reemplaza la URL con tu backend real.

### 4. Deploy

Click en **"Deploy"** y Vercel:
1. Clonará el repo
2. Detectará pnpm
3. Ejecutará `pnpm install`
4. Ejecutará `pnpm run build`
5. Desplegará el sitio

¡Tu admin panel estará listo en ~2 minutos! 🎉

---

## 🔧 Despliegue desde CLI

### 1. Instalar Vercel CLI

```bash
# Con pnpm (recomendado)
pnpm add -g vercel

# O con npm
npm i -g vercel
```

### 2. Login y Deploy

```bash
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin

# Login
vercel login

# Deploy en preview
vercel

# Deploy en producción
vercel --prod
```

---

## 🔧 Configuración Post-Deploy

### 1. Configurar CORS en el Backend

Tu frontend necesita comunicarse con el backend. En Railway, asegúrate de que la variable `CORS_ORIGINS` incluya la URL de Vercel:

```env
# En Railway (backend)
CORS_ORIGINS=https://your-admin.vercel.app,https://*.vercel.app
```

### 2. Verificar la Conexión

Después del deploy, abre la consola del navegador:

```javascript
console.log(import.meta.env.VITE_API_URL);
// Debería mostrar: https://your-backend.up.railway.app/api/v1
```

### 3. Probar Funcionalidad

1. Abre tu admin panel en Vercel
2. Intenta hacer login
3. Verifica que los datos se carguen
4. Revisa la pestaña Network en DevTools

---

## 📝 Configuración de vercel.json

Tu `vercel.json` debe tener:

```json
{
  "version": 2,
  "name": "power-bank-admin",
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Esto asegura:
- ✅ Uso de pnpm
- ✅ SPA routing funciona correctamente
- ✅ No hay 404s al refrescar páginas

---

## 🔄 Auto-Deploy y Preview

### Auto-Deploy

Cada push a `main` despliega automáticamente:

```bash
git add .
git commit -m "Update dashboard UI"
git push
# Vercel desplegará automáticamente en ~2 minutos
```

### Preview Deployments

Cada Pull Request crea un preview único:
- URL única para cada PR
- Ideal para testing antes de merge
- Se elimina automáticamente al cerrar PR

---

## 🌐 Dominio Personalizado (Opcional)

### Agregar tu Propio Dominio

1. Ve a tu proyecto en Vercel → Settings → Domains
2. Click en **"Add Domain"**
3. Ingresa tu dominio (ej: `admin.powerbank.com`)
4. Configura los DNS records:

**CNAME (Recomendado):**
```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
```

**A Record:**
```
Type: A
Name: admin
Value: 76.76.21.21
```

5. Espera propagación DNS (5-30 minutos)
6. SSL se configura automáticamente

---

## 🚨 Solución de Problemas

### Error: TS6306 - Referenced project must have "composite": true

**Síntoma:**
```bash
error TS6306: Referenced project 'tsconfig.node.json' must have setting "composite": true
```

**Solución:**
Elimina la referencia en `tsconfig.json`:

```json
{
  "compilerOptions": { ... },
  "include": ["src"]
  // Eliminar: "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Error: Variable is declared but never used

**Síntoma:**
```bash
error TS6196: 'Material' is declared but never used.
```

**Solución:**
Desactiva reglas estrictas en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```

### Error: "404 on page refresh"

**Causa**: SPA routing no configurado

**Solución**: Ya está configurado en `vercel.json` con rewrites.

### Error: "VITE_API_URL is undefined"

**Causa**: Variables de entorno no configuradas

**Solución**:
1. Vercel → Settings → Environment Variables
2. Agrega `VITE_API_URL=https://...`
3. Redeploy el proyecto

### Error: "CORS error when calling API"

**Causa**: Backend no permite tu dominio de Vercel

**Solución**: En Railway, agrega tu URL de Vercel a `CORS_ORIGINS`:
```env
CORS_ORIGINS=https://your-admin.vercel.app
```

### Error: "Build failed"

**Revisar logs**:
1. Vercel → Deployments → Click en deploy fallido
2. Revisa "Build Logs"

**Prueba local primero**:
```bash
pnpm run build
```

### Error: "pnpm: command not found"

**Causa**: Vercel no detectó `pnpm-lock.yaml`

**Solución**:
```bash
# Asegúrate de que esté en el repo
git add pnpm-lock.yaml vercel.json
git commit -m "Add pnpm configuration"
git push
```

### Warning: Chunks larger than 500 kB

**Es solo un warning**, no afecta el deploy.

**Para optimizar (opcional)**, actualiza `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    sourcemap: false,
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
});
```

---

## ✅ Verificación del Deploy

### En Vercel Logs

Deberías ver:
```bash
✓ Detected pnpm
Running "pnpm install"
Running "pnpm run build"
✓ Build completed
```

### En el Navegador

```bash
# Tu URL de Vercel
ADMIN_URL="https://your-admin.vercel.app"

# Verificar que carga
curl $ADMIN_URL

# Verificar routing
curl $ADMIN_URL/dashboard
# Debe devolver el mismo index.html
```

### DevTools

1. Abre DevTools → Network
2. Verifica que los assets se cargan desde Vercel CDN
3. Prueba login y navegación
4. Verifica que las llamadas al API funcionan

---

## 📊 Monitoreo y Analytics

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

## 💰 Costos

### Plan Hobby (Free)

- Unlimited deployments
- 100GB bandwidth/mes
- Unlimited sites
- SSL automático
- Preview deployments
- CDN global

**Tu admin panel usará ~0-5GB/mes** (dentro del free tier)

### Plan Pro ($20/mes) - Solo si necesitas

- Más analytics
- Más bandwidth (1TB)
- Password protection
- Team features

---

## 🎯 Checklist de Deployment

- [ ] Código en GitHub
- [ ] `.gitignore` configurado
- [ ] `pnpm-lock.yaml` en repo
- [ ] `vercel.json` creado
- [ ] Build exitoso localmente (`pnpm run build`)
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] CORS configurado en backend
- [ ] Deploy exitoso
- [ ] Login funciona
- [ ] API calls funcionan
- [ ] Routing funciona (refresh en /dashboard)
- [ ] Dominio personalizado (opcional)

---

## 🔄 Arquitectura Completa

```
┌─────────────────────────────────────┐
│     Frontend (Vercel)               │
│  React + Vite + Chakra UI + pnpm    │
│  https://your-admin.vercel.app      │
└──────────────┬──────────────────────┘
               │ HTTPS API Calls
               │
┌──────────────▼──────────────────────┐
│     Backend (Railway)               │
│  Node.js + Express + Prisma         │
│  https://your-api.up.railway.app    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Database (Railway)              │
│  PostgreSQL                         │
└─────────────────────────────────────┘
```

**Costos totales estimados**:
- Frontend (Vercel): $0/mes (free tier)
- Backend (Railway): $3-5/mes
- **Total: ~$0-5/mes** 🎉

---

## 🚀 Deploy Rápido (TL;DR)

```bash
# 1. Push a GitHub
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin
git add .
git commit -m "Ready for Vercel"
git push

# 2. En Vercel:
# - Import from GitHub
# - Add env var: VITE_API_URL=https://your-backend.up.railway.app/api/v1
# - Deploy

# 3. En Railway (backend):
# - Add env var: CORS_ORIGINS=https://your-admin.vercel.app
# - Redeploy

# 4. Test
# - Open https://your-admin.vercel.app
# - Login y verificar
```

---

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React on Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [pnpm + Vercel](https://vercel.com/docs/concepts/deployments/configure-a-build#using-pnpm)

---

¿Listo para deployar? ¡Solo necesitas hacer push a GitHub y conectar con Vercel! 🚀
