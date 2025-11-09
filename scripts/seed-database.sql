-- =====================================================
-- Script de Seed para Power Bank Database
-- =====================================================
-- Este script crea datos de prueba para desarrollo
-- Ejecutar desde psql o tu herramienta SQL favorita
-- =====================================================

-- PASO 1: Crear usuario administrador
-- =====================================================
-- Nota: El hash corresponde a la contraseña "Admin123!"
-- Generado con bcrypt rounds=10

INSERT INTO "User" (
  id,
  email,
  password,
  "fullName",
  phone,
  role,
  "isActive",
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'admin@powerbank.com',
  '$2b$10$YPCLLmP1OPsxTqGU0xJDUeF5hRYz8VmKfV3qm8QKj4qWvVXN2L5Pm', -- Admin123!
  'Administrador Principal',
  '+1234567890',
  'SUPER_ADMIN',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- PASO 2: Crear gabinetes en diferentes ubicaciones
-- =====================================================
-- Ubicaciones reales en Nueva York

INSERT INTO "Cabinet" (
  id,
  "cabinetId",
  name,
  description,
  location,
  address,
  latitude,
  longitude,
  "iotCardNumber",
  "signalStrength",
  "deviceId",
  "deviceSecret",
  "ipAddress",
  "connectionType",
  status,
  "lastPingAt",
  "createdAt",
  "updatedAt"
) VALUES
-- Times Square
(
  gen_random_uuid(),
  'WSTD088888888888',
  'Times Square Station',
  'Principal estación turística',
  'Times Square',
  '1560 Broadway, New York, NY 10036',
  40.7580,
  -73.9855,
  'IOT001',
  28,
  'device-001',
  '$2b$10$hash1',
  '192.168.1.101',
  'wifi',
  'ONLINE',
  NOW() - INTERVAL '5 minutes',
  NOW() - INTERVAL '6 months',
  NOW()
),
-- Central Park
(
  gen_random_uuid(),
  'WSTD088888888889',
  'Central Park South',
  'Entrada sur del parque',
  'Central Park',
  'Central Park S, New York, NY 10019',
  40.7663,
  -73.9794,
  'IOT002',
  25,
  'device-002',
  '$2b$10$hash2',
  '192.168.1.102',
  '4g',
  'ONLINE',
  NOW() - INTERVAL '3 minutes',
  NOW() - INTERVAL '5 months',
  NOW()
),
-- Brooklyn Bridge
(
  gen_random_uuid(),
  'WSTD088888888890',
  'Brooklyn Bridge Plaza',
  'Zona turística principal',
  'Brooklyn',
  'Brooklyn Bridge, New York, NY 11201',
  40.7061,
  -73.9969,
  'IOT003',
  22,
  'device-003',
  '$2b$10$hash3',
  '192.168.1.103',
  'ethernet',
  'ONLINE',
  NOW() - INTERVAL '1 minute',
  NOW() - INTERVAL '4 months',
  NOW()
),
-- Grand Central
(
  gen_random_uuid(),
  'WSTD088888888891',
  'Grand Central Terminal',
  'Estación de trenes',
  'Midtown',
  '89 E 42nd St, New York, NY 10017',
  40.7527,
  -73.9772,
  'IOT004',
  30,
  'device-004',
  '$2b$10$hash4',
  '192.168.1.104',
  'wifi',
  'ONLINE',
  NOW() - INTERVAL '2 minutes',
  NOW() - INTERVAL '3 months',
  NOW()
),
-- Empire State Building (OFFLINE para testing)
(
  gen_random_uuid(),
  'WSTD088888888892',
  'Empire State Building',
  'Edificio icónico (mantenimiento)',
  'Midtown',
  '20 W 34th St, New York, NY 10001',
  40.7484,
  -73.9857,
  'IOT005',
  0,
  'device-005',
  '$2b$10$hash5',
  '192.168.1.105',
  'wifi',
  'OFFLINE',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 months',
  NOW()
),
-- Wall Street
(
  gen_random_uuid(),
  'WSTD088888888893',
  'Wall Street Station',
  'Distrito financiero',
  'Financial District',
  '11 Wall St, New York, NY 10005',
  40.7074,
  -74.0113,
  'IOT006',
  26,
  'device-006',
  '$2b$10$hash6',
  '192.168.1.106',
  '4g',
  'ONLINE',
  NOW() - INTERVAL '4 minutes',
  NOW() - INTERVAL '1 month',
  NOW()
)
ON CONFLICT ("cabinetId") DO NOTHING;

-- PASO 3: Crear slots para cada gabinete (8 slots por gabinete)
-- =====================================================

DO $$
DECLARE
  cabinet_record RECORD;
  slot_num INT;
BEGIN
  FOR cabinet_record IN SELECT id FROM "Cabinet" LOOP
    FOR slot_num IN 1..8 LOOP
      INSERT INTO "Slot" (
        id,
        "cabinetId",
        "slotNumber",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        cabinet_record.id,
        LPAD(slot_num::TEXT, 2, '0'),
        NOW(),
        NOW()
      )
      ON CONFLICT ("cabinetId", "slotNumber") DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- PASO 4: Crear power banks en slots
-- =====================================================
-- Llenar 6 de 8 slots en cada gabinete con power banks

DO $$
DECLARE
  slot_record RECORD;
  counter INT := 1;
BEGIN
  FOR slot_record IN
    SELECT s.id, s."cabinetId", s."slotNumber"
    FROM "Slot" s
    WHERE s."slotNumber" IN ('01', '02', '03', '04', '05', '06')
    AND NOT EXISTS (
      SELECT 1 FROM "PowerBank" pb WHERE pb."slotId" = s.id
    )
  LOOP
    INSERT INTO "PowerBank" (
      id,
      "slotId",
      "batteryLevel",
      model,
      "serialNumber",
      status,
      "totalRentals",
      "lastUsedAt",
      "createdAt",
      "updatedAt"
    ) VALUES (
      'WSBA' || LPAD(counter::TEXT, 8, '0'),
      slot_record.id,
      (60 + (RANDOM() * 40))::INTEGER, -- 60-100% battery
      CASE
        WHEN RANDOM() < 0.5 THEN 'PB-5000'
        ELSE 'PB-10000'
      END,
      'SN-' || LPAD(counter::TEXT, 8, '0'),
      CASE
        WHEN RANDOM() < 0.1 THEN 'MAINTENANCE'
        WHEN RANDOM() < 0.3 THEN 'AVAILABLE'
        ELSE 'CHARGING'
      END,
      (RANDOM() * 50)::INTEGER, -- 0-50 rentas previas
      CASE
        WHEN RANDOM() < 0.5 THEN NOW() - (RANDOM() * 30 || ' days')::INTERVAL
        ELSE NULL
      END,
      NOW() - (RANDOM() * 180 || ' days')::INTERVAL,
      NOW()
    );

    counter := counter + 1;
  END LOOP;
END $$;

-- PASO 5: Crear transacciones de los últimos 90 días
-- =====================================================

DO $$
DECLARE
  user_id UUID;
  day_offset INT;
  trans_per_day INT;
  hour_random FLOAT;
  amount DECIMAL(10,2);
  trans_type TEXT;
  i INT;
BEGIN
  -- Obtener el usuario admin
  SELECT id INTO user_id FROM "User" WHERE email = 'admin@powerbank.com';

  -- Generar transacciones para los últimos 90 días
  FOR day_offset IN 0..90 LOOP
    -- Más transacciones los fines de semana
    IF EXTRACT(DOW FROM (NOW() - (day_offset || ' days')::INTERVAL)) IN (0, 6) THEN
      trans_per_day := 8 + (RANDOM() * 12)::INTEGER; -- 8-20 transacciones
    ELSE
      trans_per_day := 4 + (RANDOM() * 8)::INTEGER; -- 4-12 transacciones
    END IF;

    FOR i IN 1..trans_per_day LOOP
      -- Distribución realista de tipos de transacciones
      IF RANDOM() < 0.70 THEN
        trans_type := 'RENTAL';
        amount := (9.99 + RANDOM() * 5)::DECIMAL(10,2); -- $9.99-$14.99
      ELSIF RANDOM() < 0.90 THEN
        trans_type := 'LATE_FEE';
        amount := (5.00 + RANDOM() * 15)::DECIMAL(10,2); -- $5.00-$20.00
      ELSIF RANDOM() < 0.95 THEN
        trans_type := 'LOST_FEE';
        amount := (50.00 + RANDOM() * 50)::DECIMAL(10,2); -- $50.00-$100.00
      ELSE
        trans_type := 'REFUND';
        amount := (5.00 + RANDOM() * 20)::DECIMAL(10,2); -- $5.00-$25.00
      END IF;

      -- Hora aleatoria del día
      hour_random := RANDOM() * 24;

      INSERT INTO "Transaction" (
        id,
        "userId",
        amount,
        currency,
        status,
        type,
        description,
        "stripePaymentIntentId",
        "stripeChargeId",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        user_id,
        amount,
        'USD',
        CASE
          WHEN RANDOM() < 0.95 THEN 'COMPLETED'
          WHEN RANDOM() < 0.98 THEN 'PENDING'
          ELSE 'FAILED'
        END,
        trans_type,
        'Transacción de ' || trans_type,
        'pi_mock_' || substring(md5(random()::text), 1, 24),
        'ch_mock_' || substring(md5(random()::text), 1, 24),
        NOW() - (day_offset || ' days')::INTERVAL - (hour_random || ' hours')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL - (hour_random || ' hours')::INTERVAL
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Transacciones creadas exitosamente';
END $$;

-- PASO 6: Crear rentas de los últimos 90 días
-- =====================================================

DO $$
DECLARE
  user_id UUID;
  cabinet_ids UUID[];
  powerbank_ids TEXT[];
  day_offset INT;
  rentals_per_day INT;
  hour_random FLOAT;
  duration_hours FLOAT;
  rental_status TEXT;
  base_price DECIMAL(10,2);
  total_amount DECIMAL(10,2);
  i INT;
  random_cabinet UUID;
  random_powerbank TEXT;
BEGIN
  -- Obtener datos necesarios
  SELECT id INTO user_id FROM "User" WHERE email = 'admin@powerbank.com';
  SELECT array_agg(id) INTO cabinet_ids FROM "Cabinet";
  SELECT array_agg(id) INTO powerbank_ids FROM "PowerBank" LIMIT 20;

  -- Generar rentas para los últimos 90 días
  FOR day_offset IN 0..90 LOOP
    -- Más rentas los fines de semana
    IF EXTRACT(DOW FROM (NOW() - (day_offset || ' days')::INTERVAL)) IN (0, 6) THEN
      rentals_per_day := 6 + (RANDOM() * 10)::INTEGER; -- 6-16 rentas
    ELSE
      rentals_per_day := 3 + (RANDOM() * 6)::INTEGER; -- 3-9 rentas
    END IF;

    FOR i IN 1..rentals_per_day LOOP
      -- Selección aleatoria
      random_cabinet := cabinet_ids[1 + (RANDOM() * (array_length(cabinet_ids, 1) - 1))::INT];
      random_powerbank := powerbank_ids[1 + (RANDOM() * (array_length(powerbank_ids, 1) - 1))::INT];

      hour_random := RANDOM() * 24;
      duration_hours := 1 + (RANDOM() * 12); -- 1-13 horas
      base_price := 9.99;

      -- Determinar estado y precio
      IF RANDOM() < 0.80 THEN
        -- 80% rentas completadas a tiempo
        rental_status := 'COMPLETED';
        total_amount := base_price + (CASE WHEN duration_hours > 2 THEN (duration_hours - 2) * 2 ELSE 0 END);
      ELSIF RANDOM() < 0.95 THEN
        -- 15% rentas con retraso
        rental_status := 'COMPLETED';
        total_amount := base_price + (duration_hours * 2) + 10; -- Late fee
      ELSE
        -- 5% rentas con problemas
        rental_status := CASE
          WHEN RANDOM() < 0.5 THEN 'OVERDUE'
          ELSE 'LOST'
        END;
        total_amount := base_price + 50; -- Penalty
      END IF;

      INSERT INTO "Rental" (
        id,
        "userId",
        "cabinetId",
        "rentalCabinetId",
        "returnCabinetId",
        "powerBankId",
        "rentedAt",
        "returnedAt",
        "dueAt",
        "basePrice",
        "lateFee",
        "totalAmount",
        status,
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        user_id,
        random_cabinet,
        random_cabinet,
        CASE WHEN rental_status = 'COMPLETED' THEN random_cabinet ELSE NULL END,
        random_powerbank,
        NOW() - (day_offset || ' days')::INTERVAL - (hour_random || ' hours')::INTERVAL,
        CASE
          WHEN rental_status = 'COMPLETED'
          THEN NOW() - (day_offset || ' days')::INTERVAL - (hour_random || ' hours')::INTERVAL + (duration_hours || ' hours')::INTERVAL
          ELSE NULL
        END,
        NOW() - (day_offset || ' days')::INTERVAL - (hour_random || ' hours')::INTERVAL + '24 hours'::INTERVAL,
        base_price,
        CASE WHEN rental_status = 'COMPLETED' AND duration_hours > 24 THEN 10 ELSE 0 END,
        total_amount,
        rental_status,
        NOW() - (day_offset || ' days')::INTERVAL,
        NOW() - (day_offset || ' days')::INTERVAL
      );
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Rentas creadas exitosamente';
END $$;

-- PASO 7: Crear plan de precios
-- =====================================================

INSERT INTO "PricingPlan" (
  id,
  name,
  "basePrice",
  "hourlyRate",
  "dailyRate",
  "maxDailyCharge",
  "lateFeePerhour",
  "lostFee",
  "gracePeriodMins",
  "maxRentalDays",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'Plan Estándar',
  9.99,
  2.00,
  15.00,
  50.00,
  5.00,
  100.00,
  15,
  7,
  true,
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

DO $$
DECLARE
  user_count INT;
  cabinet_count INT;
  slot_count INT;
  powerbank_count INT;
  transaction_count INT;
  rental_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM "User";
  SELECT COUNT(*) INTO cabinet_count FROM "Cabinet";
  SELECT COUNT(*) INTO slot_count FROM "Slot";
  SELECT COUNT(*) INTO powerbank_count FROM "PowerBank";
  SELECT COUNT(*) INTO transaction_count FROM "Transaction";
  SELECT COUNT(*) INTO rental_count FROM "Rental";

  RAISE NOTICE '';
  RAISE NOTICE '================================';
  RAISE NOTICE '  SEED COMPLETADO EXITOSAMENTE';
  RAISE NOTICE '================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Estadísticas:';
  RAISE NOTICE '  - Usuarios: %', user_count;
  RAISE NOTICE '  - Gabinetes: %', cabinet_count;
  RAISE NOTICE '  - Slots: %', slot_count;
  RAISE NOTICE '  - Power Banks: %', powerbank_count;
  RAISE NOTICE '  - Transacciones: %', transaction_count;
  RAISE NOTICE '  - Rentas: %', rental_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Credenciales de acceso:';
  RAISE NOTICE '  Email: admin@powerbank.com';
  RAISE NOTICE '  Password: Admin123!';
  RAISE NOTICE '';
  RAISE NOTICE '¡Listo para usar el dashboard!';
  RAISE NOTICE '================================';
END $$;
