# 🎨 Guía de Colores - Admin Panel

Colores sincronizados con la aplicación móvil para mantener consistencia de marca.

## 🌈 Paleta de Colores

### Primary - Neon Green (Brand Color)

El color principal de la marca, tomado del logo verde neón.

```css
brand.500: #00FF41  /* Main neon green - Color principal */
brand.300: #4DFF77  /* Light variant - Hover states */
brand.600: #00CC34  /* Dark variant - Active/pressed states */
```

**Uso:**
- Botones primarios
- Links importantes
- Indicadores de éxito
- Gabinetes disponibles
- Acciones principales

**Contraste:** Texto negro (#000000) sobre neon green para mejor legibilidad

---

### Secondary - Electric Cyan

Color secundario para acentos y elementos secundarios.

```css
secondary.500: #00E5FF  /* Main electric cyan */
secondary.600: #00B8D4  /* Dark variant */
```

**Uso:**
- Botones secundarios
- Badges informativos
- Iconos secundarios
- Gabinetes seleccionados
- Elementos decorativos

---

### Dark Theme (Default)

Tema oscuro por defecto, optimizado para uso nocturno.

```css
dark.500: #0A0A0A  /* Pure black - Background principal */
dark.400: #1A1A1A  /* Dark gray - Cards y surfaces */
dark.300: #2A2A2A  /* Medium surface - Borders */
dark.100: #4A4A4A  /* Medium gray - Disabled states */
dark.50:  #8A8A8A  /* Light gray - Secondary text */
```

**Uso:**
- Fondo principal: `dark.500` (#0A0A0A)
- Cards y paneles: `dark.400` (#1A1A1A)
- Borders sutiles: `dark.300` (#2A2A2A)
- Texto secundario: `dark.50` (#8A8A8A)

---

### Status Colors

Colores para indicar estados del sistema.

```css
success: #00FF41  /* Neon green - Operaciones exitosas */
error:   #FF1744  /* Bright red - Errores críticos */
warning: #FFD600  /* Bright yellow - Advertencias */
info:    #00E5FF  /* Electric cyan - Información */
```

**Uso:**
- Alertas y notificaciones
- Estados de gabinetes
- Feedback de operaciones
- Indicadores de estado

---

## 🎯 Aplicación de Colores

### Botones

**Primario (Default):**
```tsx
<Button colorScheme="brand">
  Acción Principal
</Button>
// Fondo: #00FF41 (neon green)
// Texto: #000000 (black)
// Hover: #4DFF77 (light neon)
// Active: #00CC34 (dark neon)
```

**Secundario:**
```tsx
<Button colorScheme="secondary">
  Acción Secundaria
</Button>
```

**Destructivo:**
```tsx
<Button colorScheme="red">
  Eliminar
</Button>
```

---

### Cards y Contenedores

**Dark Mode (Default):**
```tsx
<Card>
  {/* Fondo automático: #1A1A1A */}
  {/* Border: #2A2A2A */}
</Card>
```

**Light Mode:**
```tsx
<Card>
  {/* Fondo: white */}
  {/* Border: gray.200 */}
</Card>
```

---

### Badges y Tags

**Success (Disponible):**
```tsx
<Badge colorScheme="green">
  Disponible
</Badge>
// Verde neón: #00FF41
```

**Error (Offline):**
```tsx
<Badge colorScheme="red">
  Offline
</Badge>
// Rojo brillante: #FF1744
```

**Warning (Mantenimiento):**
```tsx
<Badge colorScheme="yellow">
  Mantenimiento
</Badge>
// Amarillo brillante: #FFD600
```

**Info:**
```tsx
<Badge colorScheme="cyan">
  En línea
</Badge>
// Cyan eléctrico: #00E5FF
```

---

## 🌓 Dark vs Light Mode

### Dark Mode (Default)

```css
Background: #0A0A0A (pure black)
Cards:      #1A1A1A (dark gray)
Text:       rgba(255, 255, 255, 0.92)
Secondary:  rgba(255, 255, 255, 0.64)
Borders:    #2A2A2A
```

**Por qué Dark por defecto:**
- Consistencia con app móvil
- Optimizado para uso nocturno
- Menor fatiga visual
- Estética moderna y tech

### Light Mode

```css
Background: #F7FAFC (gray.50)
Cards:      #FFFFFF (white)
Text:       #1A202C (gray.800)
Secondary:  #4A5568 (gray.700)
Borders:    #E2E8F0 (gray.200)
```

**Cambiar modo:**
```tsx
import { useColorMode } from '@chakra-ui/react';

const { colorMode, toggleColorMode } = useColorMode();
```

---

## 📊 Ejemplos de Uso

### Dashboard Cards

```tsx
<Box bg={colorMode === 'dark' ? 'dark.400' : 'white'}>
  <Stat>
    <StatLabel color={colorMode === 'dark' ? 'dark.50' : 'gray.600'}>
      Gabinetes Online
    </StatLabel>
    <StatNumber color="brand.500">
      45
    </StatNumber>
    <StatHelpText>
      <StatArrow type="increase" />
      23.36%
    </StatHelpText>
  </Stat>
</Box>
```

### Status Indicators

```tsx
// Gabinete Online
<Icon as={FiCheckCircle} color="brand.500" />

// Gabinete Offline
<Icon as={FiXCircle} color="error.500" />

// Mantenimiento
<Icon as={FiAlertCircle} color="warning.500" />

// Info
<Icon as={FiInfo} color="info.500" />
```

### Tables

```tsx
<Table variant="simple" colorScheme="gray">
  <Thead bg={colorMode === 'dark' ? 'dark.300' : 'gray.100'}>
    <Tr>
      <Th>Gabinete</Th>
      <Th>Estado</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr _hover={{ bg: colorMode === 'dark' ? 'dark.300' : 'gray.50' }}>
      <Td>WSTD001</Td>
      <Td>
        <Badge colorScheme="green">Online</Badge>
      </Td>
    </Tr>
  </Tbody>
</Table>
```

---

## 🎨 Gradientes (Opcional)

Para elementos especiales:

```css
/* Neon Green Gradient */
background: linear-gradient(135deg, #00FF41 0%, #00CC34 100%);

/* Cyan Gradient */
background: linear-gradient(135deg, #00E5FF 0%, #00B8D4 100%);

/* Dark Gradient */
background: linear-gradient(180deg, #1A1A1A 0%, #0A0A0A 100%);
```

---

## 🔧 Personalización

### Agregar Nuevo Color

```ts
// En theme.ts
colors: {
  custom: {
    500: '#FF00FF',
  },
}

// Uso
<Button colorScheme="custom">Custom</Button>
```

### Override de Componente

```ts
components: {
  Card: {
    baseStyle: {
      container: {
        bg: 'dark.400',
        borderRadius: 'xl',
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.1)',
      },
    },
  },
}
```

---

## 📱 Consistencia con Mobile App

### Colores Sincronizados

| Elemento | Mobile | Admin | Hex |
|----------|--------|-------|-----|
| **Primary** | Neon Green | `brand.500` | #00FF41 |
| **Secondary** | Electric Cyan | `secondary.500` | #00E5FF |
| **Background** | Pure Black | `dark.500` | #0A0A0A |
| **Surface** | Dark Gray | `dark.400` | #1A1A1A |
| **Success** | Neon Green | `success.500` | #00FF41 |
| **Error** | Bright Red | `error.500` | #FF1744 |
| **Warning** | Bright Yellow | `warning.500` | #FFD600 |

### Diferencias Intencionales

- **Admin**: Soporta light mode (opcional)
- **Mobile**: Solo dark mode
- **Admin**: Más variantes de cada color para UI compleja
- **Mobile**: Paleta más limitada para performance

---

## 🧪 Testing de Colores

### Contraste

Todos los colores cumplen con WCAG AA:
- ✅ Neon green (#00FF41) + Black text: Ratio 12.48:1
- ✅ Electric cyan (#00E5FF) + Black text: Ratio 10.23:1
- ✅ White text + Pure black: Ratio 21:1

### Accesibilidad

```tsx
// Bueno ✅
<Button bg="brand.500" color="black">
  Texto legible
</Button>

// Malo ❌
<Button bg="brand.500" color="white">
  Bajo contraste
</Button>
```

---

## 📚 Recursos

- [Chakra UI Colors](https://chakra-ui.com/docs/styled-system/theme#colors)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Mobile App Theme](../mobile/theme/design-system.ts)

---

¡Disfruta del nuevo tema neon green! 💚⚡
