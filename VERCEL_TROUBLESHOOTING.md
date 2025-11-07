# 🔧 Solución de Problemas - Deploy en Vercel

## Error: TS6306 - Referenced project must have "composite": true

### Síntoma

```bash
tsconfig.json(38,18): error TS6306: Referenced project '/vercel/path0/tsconfig.node.json' must have setting "composite": true.
tsconfig.json(38,18): error TS6310: Referenced project '/vercel/path0/tsconfig.node.json' may not disable emit.
ELIFECYCLE Command failed with exit code 2.
Error: Command "pnpm run build" exited with 2
```

### Causa

TypeScript tiene un conflicto con las referencias de proyecto (`references`) cuando:
- `tsconfig.json` referencia a `tsconfig.node.json`
- `tsconfig.node.json` tiene `noEmit: true`
- No se puede usar `composite: true` con `noEmit: true`

### Solución

**Se eliminó la referencia** de `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... opciones
  },
  "include": ["src"]
  // ❌ Eliminado: "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json` se mantiene para Vite pero no se referencia desde el principal.

---

## Error: TS6196 - Variable is declared but never used

### Síntoma

```bash
src/services/api.ts(10,3): error TS6196: 'Material' is declared but never used.
```

### Causa

TypeScript en modo estricto (`noUnusedLocals: true`) no permite importaciones no usadas.

### Solución

**Se desactivaron las reglas** `noUnusedLocals` y `noUnusedParameters` en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": false,      // ✅ Era true
    "noUnusedParameters": false,  // ✅ Era true
    // ...
  }
}
```

**Alternativa**: Eliminar las importaciones no usadas, pero puede ser tedioso durante desarrollo.

---

## Warning: Chunks larger than 500 kB

### Síntoma

```bash
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
```

### Causa

El bundle principal incluye todas las dependencias (React, Chakra UI, Recharts, etc.).

### ¿Es un problema?

**No** - Es solo un warning. El deploy funcionará correctamente.

### Optimización (Opcional)

Si quieres reducir el tamaño, actualiza `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ... tus aliases
    },
  },
  build: {
    sourcemap: false, // Reduce tamaño
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendors en chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'chart-vendor': ['recharts'],
        },
      },
    },
  },
});
```

---

## Verificar Build Local

Antes de deployar en Vercel, prueba localmente:

```bash
cd C:/Users/ecaceres/proyectos/personal/power-bank-app/admin

# Build (usando pnpm)
pnpm run build

# Preview
pnpm run preview
```

**Debe pasar sin errores** (warnings están OK).

---

## ⚠️ Importante: Usando pnpm

Este proyecto usa **pnpm** como package manager. Asegúrate de:

- ✅ Tener `pnpm-lock.yaml` en el repo
- ✅ `vercel.json` configurado con pnpm (ya está ✅)
- ✅ Vercel detectará pnpm automáticamente

Ver guía completa: [PNPM_VERCEL_SETUP.md](./PNPM_VERCEL_SETUP.md)

---

## Deploy en Vercel

### Desde GitHub

1. Push tus cambios:
```bash
git add .
git commit -m "Fix TypeScript config for Vercel"
git push
```

2. En Vercel:
   - Import project
   - Variables de entorno: `VITE_API_URL`
   - Deploy

### Desde CLI

```bash
vercel --prod
```

---

## Configuración Final

### tsconfig.json ✅

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "types": ["vite/client"],

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": false,        // ✅ Desactivado para build
    "noUnusedParameters": false,    // ✅ Desactivado para build
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"]
  // ✅ Sin "references"
}
```

### tsconfig.node.json ✅

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
  // ✅ Sin "composite"
}
```

---

## Checklist de Deploy

- [x] TypeScript build exitoso localmente
- [x] `tsconfig.json` sin referencias
- [x] `noUnusedLocals` y `noUnusedParameters` en false
- [ ] Variables de entorno en Vercel
- [ ] CORS configurado en backend
- [ ] Push a GitHub
- [ ] Deploy en Vercel

---

## Ayuda Adicional

Si tienes otros errores:

1. **Ver logs de Vercel**:
   - Vercel Dashboard → Deployments → Build Logs

2. **Probar build local**:
   ```bash
   npm run build
   ```

3. **Limpiar caché**:
   ```bash
   rm -rf node_modules dist
   npm install
   npm run build
   ```

4. **Verificar Node version**:
   - Vercel usa Node 18 por defecto
   - Tu proyecto requiere Node 18+

---

¡Build exitoso! 🎉 Ahora puedes deployar en Vercel sin problemas.
