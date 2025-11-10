# 📊 Visualizaciones del Dashboard - Guía Rápida

## 🚀 Inicio Rápido

### 1. Verificar Conexión con el Backend

Ejecuta el script de verificación automática:

```bash
cd /Users/vue/personal-projects/power-bank/power-bank-app
./scripts/verify-backend.sh
```

Este script verificará:
- ✅ Que el backend esté corriendo
- ✅ Que puedas autenticarte
- ✅ Que todos los endpoints respondan correctamente
- ✅ Que haya datos en la base de datos

### 2. Poblar la Base de Datos (Primera vez)

Si es la primera vez que ejecutas el proyecto o necesitas datos de prueba:

```bash
# Opción A: Usando psql
cd /Users/vue/personal-projects/power-bank/power-bank-api
psql -U postgres -d powerbank_db -f ../power-bank-app/scripts/seed-database.sql

# Opción B: Usando el cliente de PostgreSQL de tu preferencia
# Abre el archivo scripts/seed-database.sql y ejecútalo
```

Este script creará:
- 1 usuario administrador (`admin@powerbank.com` / `Admin123!`)
- 6 gabinetes con coordenadas en Nueva York
- 48 slots (8 por gabinete)
- ~36 power banks distribuidos en los slots
- ~900 transacciones de los últimos 90 días
- ~600 rentas de los últimos 90 días
- 1 plan de precios

### 3. Iniciar el Frontend

```bash
cd /Users/vue/personal-projects/power-bank/power-bank-app
pnpm run dev
```

### 4. Acceder al Dashboard

1. Abre `http://localhost:5173`
2. Inicia sesión con:
   - **Email**: `admin@powerbank.com`
   - **Password**: `Admin123!`
3. Navega al Dashboard
4. ¡Disfruta de las visualizaciones con datos reales! 🎉

---

## 📊 Visualizaciones Disponibles

### 🗺️ Mapa Interactivo de Gabinetes

- **Ubicación**: Dashboard superior
- **Características**:
  - Marcadores de colores por estado
  - Popups con información detallada
  - Auto-centrado en todos los gabinetes
  - Click para ver detalles completos

**Marcadores**:
- 🟢 Verde: Online con baterías disponibles
- 🟡 Amarillo: Online sin baterías
- ⚫ Gris: Offline

### 💰 Gráfico de Ingresos

- **Ubicación**: Dashboard segunda sección
- **Características**:
  - Filtros de período (7d, 30d, 90d, 1 año)
  - 4 tarjetas con métricas clave
  - Gráfico de área interactivo
  - Desglose por tipo de transacción
  - Promedio por transacción

**Períodos disponibles**:
- 7 días - Vista semanal
- 30 días - Vista mensual (por defecto)
- 90 días - Vista trimestral
- 1 año - Vista anual

---

## 🔧 Solución de Problemas Comunes

### Problema: "Datos de ejemplo" aparece en el gráfico

**Causas posibles**:
1. El backend no está corriendo
2. No has iniciado sesión
3. Tu usuario no tiene rol ADMIN

**Solución**:
```bash
# 1. Verificar que el backend esté corriendo
curl http://localhost:3000/health

# 2. Ejecutar el script de verificación
./scripts/verify-backend.sh

# 3. Si todo está bien, cierra sesión y vuelve a iniciar
```

### Problema: El mapa está vacío

**Causa**: No hay gabinetes con coordenadas en la base de datos.

**Solución**:
```bash
# Ejecutar el script de seed
psql -U postgres -d powerbank_db -f scripts/seed-database.sql
```

### Problema: Error 401 Unauthorized

**Causa**: Token JWT inválido o expirado.

**Solución**:
1. Cierra sesión en el frontend
2. Vuelve a iniciar sesión
3. El token se refrescará automáticamente

### Problema: CORS Error

**Causa**: El backend no permite requests desde el frontend.

**Solución**:
Verifica el archivo `.env` del backend:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 📁 Estructura de Archivos

```
power-bank-app/
├── scripts/
│   ├── verify-backend.sh       # Script de verificación automática
│   └── seed-database.sql       # Script para poblar la BD
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── CabinetMap.tsx      # Mapa de gabinetes
│   │   │   └── RevenueChart.tsx    # Gráfico de ingresos
│   │   └── common/
│   │       └── Card.tsx            # Componente Card
│   ├── hooks/
│   │   └── useMockRevenueData.ts   # Datos de ejemplo
│   ├── services/
│   │   └── api.ts                  # Cliente API
│   └── types/
│       └── api.types.ts            # Tipos TypeScript
├── SETUP_GUIDE.md              # Guía completa de configuración
├── NUEVAS_VISUALIZACIONES.md   # Documentación técnica
├── CHANGELOG_VISUALIZACIONES.md # Registro de cambios
└── README_VISUALIZACIONES.md   # Este archivo (guía rápida)
```

---

## 🎯 Checklist de Verificación

Antes de usar las visualizaciones, verifica:

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Usuario SUPER_ADMIN existe en la BD
- [ ] Base de datos poblada con datos (ejecutar seed)
- [ ] Variables de entorno configuradas
- [ ] Puedes iniciar sesión correctamente
- [ ] Token JWT válido en localStorage

Si todos los puntos están marcados, las visualizaciones deberían funcionar perfectamente.

---

## 📚 Documentación Adicional

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Guía detallada de configuración paso a paso
- **[NUEVAS_VISUALIZACIONES.md](NUEVAS_VISUALIZACIONES.md)** - Documentación técnica completa
- **[CHANGELOG_VISUALIZACIONES.md](CHANGELOG_VISUALIZACIONES.md)** - Historial de cambios

---

## 🆘 Ayuda

Si después de seguir esta guía aún tienes problemas:

1. Ejecuta el script de verificación: `./scripts/verify-backend.sh`
2. Revisa los logs del backend para errores
3. Abre las DevTools del navegador y revisa la consola
4. Consulta la [guía completa de configuración](SETUP_GUIDE.md)

---

## 🎉 ¡Listo!

Si has llegado hasta aquí y todo funciona, ¡felicidades! Ahora tienes:

- ✅ Un mapa interactivo mostrando tus gabinetes
- ✅ Gráficos de ingresos con datos reales
- ✅ Análisis de métricas de negocio
- ✅ Dashboard completamente funcional

**¡Disfruta de tus visualizaciones!** 🚀📊🗺️
