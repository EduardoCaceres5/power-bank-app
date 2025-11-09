#!/bin/bash

# Script para verificar la conexión con el backend
# Uso: ./scripts/verify-backend.sh

set -e

BACKEND_URL="${VITE_API_URL:-http://localhost:3000/api/v1}"
echo "🔍 Verificando conexión con backend: $BACKEND_URL"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar endpoint
check_endpoint() {
  local url=$1
  local name=$2
  local needs_auth=$3

  echo -n "Verificando $name... "

  if [ "$needs_auth" = "true" ] && [ -z "$TOKEN" ]; then
    echo -e "${YELLOW}SKIP${NC} (requiere autenticación)"
    return
  fi

  local headers=""
  if [ "$needs_auth" = "true" ]; then
    headers="-H \"Authorization: Bearer $TOKEN\""
  fi

  if eval curl -s -f -o /dev/null -w "%{http_code}" $headers "$url" | grep -q "200"; then
    echo -e "${GREEN}✓ OK${NC}"
  else
    echo -e "${RED}✗ FAIL${NC}"
    ERRORS=$((ERRORS + 1))
  fi
}

ERRORS=0

# 1. Verificar que el backend esté corriendo
echo "1️⃣  Verificando servidor backend..."
if curl -s -f -o /dev/null "$BACKEND_URL/../health" 2>/dev/null; then
  echo -e "${GREEN}✓ Backend está corriendo${NC}"
else
  echo -e "${RED}✗ Backend NO responde en $BACKEND_URL${NC}"
  echo ""
  echo "Por favor asegúrate de que el backend esté corriendo:"
  echo "  cd /Users/vue/personal-projects/power-bank/power-bank-api"
  echo "  pnpm run dev"
  exit 1
fi
echo ""

# 2. Intentar autenticación
echo "2️⃣  Verificando autenticación..."
read -p "Email del admin: " EMAIL
read -s -p "Password: " PASSWORD
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" 2>/dev/null)

if echo "$LOGIN_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token')
  USER_ROLE=$(echo "$LOGIN_RESPONSE" | jq -r '.data.user.role')
  echo -e "${GREEN}✓ Autenticación exitosa${NC}"
  echo "  Rol: $USER_ROLE"

  if [ "$USER_ROLE" != "ADMIN" ] && [ "$USER_ROLE" != "SUPER_ADMIN" ]; then
    echo -e "${YELLOW}⚠ Advertencia: El usuario no tiene rol de administrador${NC}"
    echo "  Los endpoints de analytics requieren rol ADMIN o SUPER_ADMIN"
  fi
else
  echo -e "${RED}✗ Error de autenticación${NC}"
  echo "  Verifica tus credenciales"
  echo ""
  echo "Respuesta del servidor:"
  echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
  exit 1
fi
echo ""

# 3. Verificar endpoints públicos
echo "3️⃣  Verificando endpoints públicos..."
check_endpoint "$BACKEND_URL/cabinets" "GET /cabinets" false
check_endpoint "$BACKEND_URL/cabinets/nearby?latitude=40.7128&longitude=-74.0060" "GET /cabinets/nearby" false
echo ""

# 4. Verificar endpoints de admin
echo "4️⃣  Verificando endpoints de admin..."
check_endpoint "$BACKEND_URL/admin/dashboard" "GET /admin/dashboard" true
check_endpoint "$BACKEND_URL/admin/revenue/stats?period=30d" "GET /admin/revenue/stats" true
check_endpoint "$BACKEND_URL/admin/rentals/stats?period=30d" "GET /admin/rentals/stats" true
check_endpoint "$BACKEND_URL/admin/cabinets/stats" "GET /admin/cabinets/stats" true
check_endpoint "$BACKEND_URL/admin/alerts" "GET /admin/alerts" true
echo ""

# 5. Verificar datos en la base de datos
echo "5️⃣  Verificando datos en el backend..."

echo -n "Verificando gabinetes con coordenadas... "
CABINETS_RESPONSE=$(curl -s "$BACKEND_URL/cabinets")
CABINETS_WITH_COORDS=$(echo "$CABINETS_RESPONSE" | jq '[.data.list[]? | select(.latitude != null and .longitude != null)] | length' 2>/dev/null || echo "0")
if [ "$CABINETS_WITH_COORDS" -gt 0 ]; then
  echo -e "${GREEN}✓ $CABINETS_WITH_COORDS gabinetes con coordenadas${NC}"
else
  echo -e "${YELLOW}⚠ No hay gabinetes con coordenadas${NC}"
  echo "  El mapa estará vacío. Agrega coordenadas a tus gabinetes."
fi

echo -n "Verificando transacciones... "
REVENUE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/admin/revenue/stats?period=30d")
TRANSACTION_COUNT=$(echo "$REVENUE_RESPONSE" | jq '.data.summary.transactionCount' 2>/dev/null || echo "0")
if [ "$TRANSACTION_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ $TRANSACTION_COUNT transacciones encontradas${NC}"
else
  echo -e "${YELLOW}⚠ No hay transacciones${NC}"
  echo "  El gráfico de ingresos usará datos de ejemplo."
fi

echo -n "Verificando rentas... "
RENTALS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/admin/rentals/stats?period=30d")
RENTALS_COUNT=$(echo "$RENTALS_RESPONSE" | jq '.data.summary.total' 2>/dev/null || echo "0")
if [ "$RENTALS_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ $RENTALS_COUNT rentas encontradas${NC}"
else
  echo -e "${YELLOW}⚠ No hay rentas${NC}"
  echo "  Las estadísticas de rentas estarán vacías."
fi

echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ Verificación completada exitosamente${NC}"
  echo ""
  echo "Tu configuración está lista para usar. Puedes:"
  echo "  1. Iniciar el frontend: pnpm run dev"
  echo "  2. Ir a http://localhost:5173"
  echo "  3. Iniciar sesión con: $EMAIL"
  echo "  4. Ver el dashboard con datos reales"

  if [ "$TRANSACTION_COUNT" -eq 0 ] || [ "$CABINETS_WITH_COORDS" -eq 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠ Recomendación:${NC}"
    echo "  Consulta SETUP_GUIDE.md para poblar la base de datos con datos de prueba"
  fi
else
  echo -e "${RED}❌ Se encontraron $ERRORS errores${NC}"
  echo ""
  echo "Revisa los mensajes de error anteriores y consulta SETUP_GUIDE.md"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
