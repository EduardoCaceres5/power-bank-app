# 📦 Deploy en Vercel con pnpm

Tu proyecto usa **pnpm** como package manager. Aquí está cómo configurarlo correctamente en Vercel.

## ✅ Configuración Automática

Vercel detecta automáticamente pnpm si tienes `pnpm-lock.yaml` en tu repo. ✅

**Tu proyecto ya tiene:**
- ✅ `pnpm-lock.yaml`
- ✅ `vercel.json` configurado con pnpm

---

## 🚀 Deploy desde GitHub

### 1. Push a GitHub

```bash
cd C:\Users\ecaceres\proyectos\personal\power-bank-app\admin

# Asegúrate de incluir pnpm-lock.yaml
git add pnpm-lock.yaml package.json vercel.json
git commit -m "Configure pnpm for Vercel"
git push
```

### 2. Importar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. **New Project** → **Import Git Repository**
3. Selecciona tu repo `power-bank-admin`

**Vercel detectará automáticamente:**
- ✅ Package Manager: **pnpm**
- ✅ Framework: **Vite**
- ✅ Build Command: `pnpm run build`
- ✅ Output Directory: `dist`

### 3. Configurar Variables de Entorno

Antes de deploy, agrega:

```env
VITE_API_URL=https://tu-backend.up.railway.app/api/v1
VITE_APP_NAME=Power Bank Admin
VITE_APP_VERSION=1.0.0
```

### 4. Deploy

Click **Deploy** y Vercel:
1. Detectará pnpm
2. Ejecutará `pnpm install`
3. Ejecutará `pnpm run build`
4. Desplegará el sitio

---

## 🔧 Deploy desde CLI

### Instalar Vercel CLI

```bash
# Con pnpm
pnpm add -g vercel

# O con npm (solo para CLI)
npm i -g vercel
```

### Deploy

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

## 📝 Archivo vercel.json

Tu `vercel.json` ya está configurado para pnpm:

```json
{
  "version": 2,
  "name": "power-bank-admin",
  "buildCommand": "pnpm run build",      // ✅ pnpm
  "installCommand": "pnpm install",       // ✅ pnpm
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## 🔍 Verificar que Vercel usa pnpm

Después del deploy, revisa los logs:

**En Vercel Dashboard → Deployments → Build Logs:**

Deberías ver:
```bash
✓ Detected pnpm
Running "pnpm install"
Running "pnpm run build"
```

---

## 🚨 Troubleshooting

### Error: "pnpm: command not found"

**Causa:** Vercel no detectó el `pnpm-lock.yaml`

**Solución:**
```bash
# Asegúrate de que pnpm-lock.yaml esté en el repo
git add pnpm-lock.yaml
git commit -m "Add pnpm lock file"
git push

# O fuerza el uso de pnpm en vercel.json (ya está configurado)
```

### Error: "Lockfile is out of date"

**Causa:** `pnpm-lock.yaml` no está sincronizado con `package.json`

**Solución:**
```bash
# Actualizar lockfile
pnpm install

# Commit cambios
git add pnpm-lock.yaml
git commit -m "Update pnpm lockfile"
git push
```

### Vercel usa npm en lugar de pnpm

**Causa:** No se detectó correctamente

**Solución:** Verifica en `vercel.json`:
```json
{
  "installCommand": "pnpm install"
}
```

### Error durante pnpm install

**Revisar logs:**
```bash
vercel logs [deployment-url]
```

**Limpiar y reinstalar:**
```bash
# Local
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Commit
git add pnpm-lock.yaml
git push
```

---

## 📊 Comparación: npm vs pnpm

| Característica | npm | pnpm |
|----------------|-----|------|
| **Velocidad** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Espacio en disco** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Compatibilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Vercel support** | ✅ | ✅ |

**Tu elección de pnpm es excelente** para proyectos medianos/grandes. ✅

---

## 🎯 Checklist de Deploy

- [x] `pnpm-lock.yaml` en el repo
- [x] `vercel.json` configurado con pnpm
- [x] `package.json` tiene scripts correctos
- [ ] Variables de entorno configuradas
- [ ] Push a GitHub
- [ ] Import en Vercel
- [ ] Verificar que usa pnpm en logs

---

## 🔄 Actualizar Dependencias

### Local

```bash
# Actualizar todas las dependencias
pnpm update

# Actualizar una específica
pnpm update react

# Actualizar a latest
pnpm update --latest
```

### Después de actualizar

```bash
# Build local
pnpm run build

# Commit
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push

# Vercel redesplegará automáticamente
```

---

## 💡 Tips de Performance

### 1. Cache de pnpm en Vercel

Vercel cachea automáticamente:
- `~/.pnpm-store` (global store)
- `node_modules/.pnpm` (virtual store)

Esto hace los deploys más rápidos. ⚡

### 2. Monorepo con pnpm

Si en el futuro tienes un monorepo:

```yaml
# pnpm-workspace.yaml
packages:
  - 'admin'
  - 'backend'
  - 'mobile'
```

Vercel soporta workspaces de pnpm automáticamente.

---

## 📚 Recursos

- [Vercel + pnpm Docs](https://vercel.com/docs/concepts/deployments/configure-a-build#using-pnpm)
- [pnpm Docs](https://pnpm.io)
- [pnpm vs npm](https://pnpm.io/benchmarks)

---

## 🚀 Deploy Rápido (TL;DR)

```bash
# 1. Verificar archivos
ls pnpm-lock.yaml  # ✅ Debe existir
cat vercel.json    # ✅ Debe tener pnpm commands

# 2. Push
git add .
git commit -m "Ready for Vercel with pnpm"
git push

# 3. Deploy
# - Import en Vercel desde GitHub
# - Vercel detecta pnpm automáticamente
# - Add env vars
# - Deploy
```

---

¡Listo! Vercel usará pnpm para instalar y buildear tu proyecto. 🎉
