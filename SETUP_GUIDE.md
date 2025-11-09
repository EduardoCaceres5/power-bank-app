# 🚀 Guía de Configuración - Power Bank Admin

Esta guía te ayudará a configurar y verificar la conexión entre el frontend y el backend para que las visualizaciones funcionen con datos reales.

---

## 📋 Pre-requisitos

- ✅ Node.js v18+ instalado
- ✅ PostgreSQL corriendo
- ✅ Backend (`power-bank-api`) configurado
- ✅ Frontend (`power-bank-app`) configurado

---

## 🔧 Configuración del Backend

### 1. Variables de Entorno del Backend

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

# Stripe (opcional para desarrollo)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 2. Iniciar el Backend

```bash
cd /Users/vue/personal-projects/power-bank/power-bank-api
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy  # o migrate dev
pnpm run dev
```

El servidor debería estar corriendo en: `http://localhost:3000`

### 3. Verificar que el Backend Responde

```bash
# Verificar health check
curl http://localhost:3000/health

# Debería responder:
# {"status":"ok","timestamp":"..."}
```

---

## 🎨 Configuración del Frontend

### 1. Variables de Entorno del Frontend

Crea/verifica el archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 2. Iniciar el Frontend

```bash
cd /Users/vue/personal-projects/power-bank/power-bank-app
pnpm install
pnpm run dev
```

El frontend debería estar corriendo en: `http://localhost:5173`

---

## 👤 Crear Usuario Administrador

Para acceder a los endpoints de analytics, necesitas un usuario con rol `ADMIN` o `SUPER_ADMIN`.

### Opción 1: Usando Prisma Studio

```bash
cd /Users/vue/personal-projects/power-bank/power-bank-api
pnpm prisma studio
```

1. Ve a la tabla `User`
2. Crea un nuevo usuario:
   - email: `admin@powerbank.com`
   - password: (genera un hash bcrypt - ver opción 2)
   - role: `SUPER_ADMIN`
   - isActive: `true`
   - emailVerified: `true`

### Opción 2: Usando el Endpoint de Registro (si está habilitado)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@powerbank.com",
    "password": "Admin123!",
    "fullName": "Administrador",
    "phone": "+1234567890"
  }'
```

Luego actualiza el rol en la base de datos a `SUPER_ADMIN`.

### Opción 3: Script SQL Directo

Conecta a tu base de datos PostgreSQL y ejecuta:

```sql
-- Generar hash de password (ejemplo con bcrypt online o usar bcrypt en Node)
-- Password: Admin123! -> $2b$10$...hash...

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
  '$2b$10$YourBcryptHashHere',  -- Cambia esto
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
);
```

---

## 🔐 Autenticación en el Frontend

### 1. Iniciar Sesión

1. Abre el frontend: `http://localhost:5173`
2. Ve a la página de login
3. Ingresa las credenciales:
   - Email: `admin@powerbank.com`
   - Password: `Admin123!` (o la que configuraste)

### 2. Verificar Token JWT

Después de iniciar sesión, abre las DevTools del navegador:

```javascript
// En la consola del navegador
localStorage.getItem('auth_token')

// Debería mostrar un token JWT como:
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Verificar Usuario en LocalStorage

```javascript
// En la consola del navegador
JSON.parse(localStorage.getItem('auth_user'))

// Debería mostrar:
// {
//   id: "...",
//   email: "admin@powerbank.com",
//   role: "SUPER_ADMIN",
//   ...
// }
```

---

## 📊 Poblar la Base de Datos con Datos de Prueba

Para que las visualizaciones muestren información, necesitas datos en la base de datos.

### 1. Crear Gabinetes con Coordenadas

```sql
-- Ejemplo: Gabinetes en diferentes ubicaciones
INSERT INTO "Cabinet" (
  id,
  "cabinetId",
  name,
  location,
  address,
  latitude,
  longitude,
  status,
  "deviceId",
  "createdAt",
  "updatedAt"
) VALUES
(
  gen_random_uuid(),
  'WSTD088888888888',
  'Gabinete Centro',
  'Downtown',
  '123 Main St, City',
  40.7128,
  -74.0060,
  'ONLINE',
  'device-001',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'WSTD088888888889',
  'Gabinete Norte',
  'North District',
  '456 North Ave, City',
  40.7580,
  -73.9855,
  'ONLINE',
  'device-002',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'WSTD088888888890',
  'Gabinete Sur',
  'South District',
  '789 South Blvd, City',
  40.6782,
  -73.9442,
  'OFFLINE',
  'device-003',
  NOW(),
  NOW()
);
```

### 2. Crear Slots para los Gabinets

```sql
-- Crear 8 slots para cada gabinete
DO $$
DECLARE
  cabinet_record RECORD;
  slot_num INT;
BEGIN
  FOR cabinet_record IN SELECT id FROM "Cabinet" LOOP
    FOR slot_num IN 1..8 LOOP
      INSERT INTO "Slot" (id, "cabinetId", "slotNumber", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        cabinet_record.id,
        LPAD(slot_num::TEXT, 2, '0'),
        NOW(),
        NOW()
      );
    END LOOP;
  END LOOP;
END $$;
```

### 3. Crear Power Banks

```sql
-- Insertar power banks en algunos slots
WITH slots AS (
  SELECT id, "cabinetId", "slotNumber"
  FROM "Slot"
  WHERE "slotNumber" IN ('01', '02', '03', '04', '05')
)
INSERT INTO "PowerBank" (
  id,
  "slotId",
  "batteryLevel",
  model,
  "serialNumber",
  status,
  "totalRentals",
  "createdAt",
  "updatedAt"
)
SELECT
  'WSBA' || LPAD((ROW_NUMBER() OVER())::TEXT, 8, '0'),
  s.id,
  (50 + (RANDOM() * 50))::INTEGER,
  'PB-5000',
  'SN-' || LPAD((ROW_NUMBER() OVER())::TEXT, 6, '0'),
  'CHARGING',
  0,
  NOW(),
  NOW()
FROM slots s;
```

### 4. Crear Transacciones de Ejemplo (para Revenue Chart)

```sql
-- Crear transacciones de los últimos 30 días
DO $$
DECLARE
  user_id UUID;
  day_offset INT;
  trans_count INT;
  amount DECIMAL(10,2);
BEGIN
  -- Obtener o crear un usuario
  SELECT id INTO user_id FROM "User" WHERE role = 'SUPER_ADMIN' LIMIT 1;

  -- Generar transacciones para los últimos 30 días
  FOR day_offset IN 0..30 LOOP
    -- 3-10 transacciones por día
    trans_count := 3 + (RANDOM() * 7)::INTEGER;

    FOR i IN 1..trans_count LOOP
      -- Monto aleatorio entre $5 y $50
      amount := (5 + RANDOM() * 45)::DECIMAL(10,2);

      INSERT INTO "Transaction" (
        id,
        "userId",
        amount,
        currency,
        status,
        type,
        "stripePaymentIntentId",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        user_id,
        amount,
        'USD',
        'COMPLETED',
        CASE
          WHEN RANDOM() < 0.7 THEN 'RENTAL'
          WHEN RANDOM() < 0.9 THEN 'LATE_FEE'
          ELSE 'LOST_FEE'
        END,
        'pi_mock_' || gen_random_uuid()::TEXT,
        NOW() - (day_offset || ' days')::INTERVAL - (RANDOM() * 24 || ' hours')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL
      );
    END LOOP;
  END LOOP;
END $$;
```

### 5. Crear Rentas de Ejemplo

```sql
-- Crear rentas de los últimos 30 días
DO $$
DECLARE
  user_id UUID;
  cabinet_id UUID;
  powerbank_id TEXT;
  day_offset INT;
  rental_count INT;
BEGIN
  SELECT id INTO user_id FROM "User" WHERE role = 'SUPER_ADMIN' LIMIT 1;
  SELECT id INTO cabinet_id FROM "Cabinet" LIMIT 1;
  SELECT id INTO powerbank_id FROM "PowerBank" LIMIT 1;

  FOR day_offset IN 0..30 LOOP
    rental_count := 2 + (RANDOM() * 5)::INTEGER;

    FOR i IN 1..rental_count LOOP
      INSERT INTO "Rental" (
        id,
        "userId",
        "cabinetId",
        "powerBankId",
        "rentedAt",
        "returnedAt",
        "dueAt",
        "basePrice",
        "totalAmount",
        status,
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        user_id,
        cabinet_id,
        powerbank_id,
        NOW() - (day_offset || ' days')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL + (2 + RANDOM() * 10 || ' hours')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL + '24 hours'::INTERVAL,
        9.99,
        (9.99 + RANDOM() * 10)::DECIMAL(10,2),
        'COMPLETED',
        NOW() - (day_offset || ' days')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL
      );
    END LOOP;
  END LOOP;
END $$;
```

---

## ✅ Verificación de la Configuración

### 1. Verificar Endpoints del Backend

Abre una terminal y prueba cada endpoint:

```bash
# Obtener token JWT primero
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@powerbank.com","password":"Admin123!"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"

# Dashboard Overview
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/admin/dashboard | jq

# Revenue Stats
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/admin/revenue/stats?period=30d" | jq

# Rental Stats
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:3000/api/v1/admin/rentals/stats?period=30d" | jq

# System Alerts
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/admin/alerts | jq

# Nearby Cabinets (público)
curl "http://localhost:3000/api/v1/cabinets/nearby?latitude=40.7128&longitude=-74.0060&radius=10" | jq

# All Cabinets Stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/v1/admin/cabinets/stats | jq
```

### 2. Verificar en el Frontend

1. Abre el navegador en `http://localhost:5173`
2. Inicia sesión con tu usuario admin
3. Ve al Dashboard
4. Deberías ver:
   - ✅ **Mapa de Gabinetes** mostrando los gabinetes con coordenadas
   - ✅ **Gráfico de Ingresos** mostrando datos reales (SIN el badge "Datos de ejemplo")
   - ✅ Tarjetas con métricas actualizadas

### 3. Verificar en DevTools

Abre las DevTools (F12) y ve a la pestaña Network:

1. Filtra por `admin/revenue/stats`
2. Deberías ver:
   - Status: `200 OK`
   - Response con datos reales del backend

Si ves el badge "Datos de ejemplo", significa que:
- ❌ El endpoint no está respondiendo correctamente
- ❌ No hay autenticación válida
- ❌ El backend no está corriendo

---

## 🔍 Solución de Problemas

### Problema 1: "Datos de ejemplo" en Revenue Chart

**Causa**: El endpoint no está devolviendo datos válidos.

**Solución**:
1. Verifica que el backend esté corriendo
2. Verifica el token JWT en localStorage
3. Revisa la consola del navegador para errores
4. Verifica la pestaña Network para ver la respuesta del servidor

```javascript
// En consola del navegador
localStorage.getItem('auth_token')  // ¿Existe?

// Hacer request manual
fetch('http://localhost:3000/api/v1/admin/revenue/stats?period=30d', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(r => r.json())
.then(console.log)
```

### Problema 2: Mapa vacío

**Causa**: No hay gabinetes con coordenadas.

**Solución**:
```sql
-- Verificar gabinetes con coordenadas
SELECT id, "cabinetId", latitude, longitude
FROM "Cabinet"
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Si no hay ninguno, agregar coordenadas
UPDATE "Cabinet"
SET
  latitude = 40.7128,
  longitude = -74.0060,
  address = '123 Main St, New York, NY'
WHERE id = (SELECT id FROM "Cabinet" LIMIT 1);
```

### Problema 3: Error CORS

**Causa**: El backend no permite requests desde el frontend.

**Solución**:
Verifica en el backend que CORS_ORIGIN incluya `http://localhost:5173`:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### Problema 4: 401 Unauthorized

**Causa**: Token JWT inválido o expirado.

**Solución**:
1. Cierra sesión y vuelve a iniciar
2. Verifica que el usuario tenga rol ADMIN o SUPER_ADMIN
3. Verifica JWT_SECRET en el backend

### Problema 5: No hay datos en los gráficos

**Causa**: Base de datos vacía.

**Solución**:
Ejecuta los scripts SQL de la sección "Poblar la Base de Datos".

---

## 📊 Estructura de Datos Esperada

### Revenue Stats Response
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRevenue": 15234.50,
      "transactionCount": 342,
      "averageTransaction": 44.54
    },
    "byDay": [
      {
        "date": "2025-01-01",
        "revenue": 523.45,
        "transactionCount": 12
      }
    ],
    "byType": [
      {
        "type": "RENTAL",
        "total": 10000.00,
        "count": 250
      }
    ],
    "topCabinets": [
      {
        "cabinetId": "WSTD088888888888",
        "revenue": 5000.00
      }
    ]
  }
}
```

---

## 🎯 Checklist Final

Antes de considerar que todo está configurado correctamente:

- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Usuario SUPER_ADMIN creado
- [ ] Token JWT válido en localStorage
- [ ] Al menos 3 gabinetes con coordenadas
- [ ] Al menos 30 días de transacciones
- [ ] Al menos 30 días de rentas
- [ ] Endpoint `/admin/revenue/stats` respondiendo 200
- [ ] Endpoint `/admin/dashboard` respondiendo 200
- [ ] Mapa mostrando gabinetes
- [ ] Gráfico de ingresos SIN badge "Datos de ejemplo"
- [ ] Todas las métricas del dashboard actualizadas

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del backend
2. Revisa la consola del navegador (DevTools)
3. Verifica la pestaña Network en DevTools
4. Ejecuta los comandos de verificación de esta guía

---

**¡Listo!** Si todos los pasos están completados, deberías tener un dashboard completamente funcional con datos reales. 🎉
