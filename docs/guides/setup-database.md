# Configuración de Base de Datos

Guía detallada para poblar la base de datos con datos de prueba para el panel de administración.

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

## ✅ Verificación de Endpoints

Verifica que el backend responda correctamente:

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

---

## 🔍 Solución de Problemas

### Problema: Mapa vacío

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

### Problema: No hay datos en los gráficos

**Causa**: Base de datos vacía.

**Solución**:
Ejecuta los scripts SQL de esta guía.

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

## 🎯 Checklist

- [ ] Al menos 3 gabinetes con coordenadas
- [ ] Slots creados para cada gabinete
- [ ] Power banks asignados a slots
- [ ] Al menos 30 días de transacciones
- [ ] Al menos 30 días de rentas
- [ ] Endpoints respondiendo correctamente

---

¡Listo! Tu base de datos está lista para mostrar datos reales en el dashboard. 🎉
