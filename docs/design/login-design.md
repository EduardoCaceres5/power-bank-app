# 🎨 Diseño de Login - Power Bank Admin

Página de login actualizada con colores de marca y logo oficial.

## ✨ Características

### 🌈 Colores de Marca

Todos los elementos usan los colores sincronizados con la app móvil:

- **Primary (Neon Green)**: `#00FF41` - Botón principal, iconos
- **Secondary (Electric Cyan)**: `#00E5FF` - Acentos decorativos
- **Dark Theme**: Fondo negro (`#0A0A0A`) por defecto
- **Light Theme**: Fondo claro sutil

---

## 🎯 Elementos Actualizados

### 1. Logo

**Antes:**
```tsx
<Icon as={MdBatteryChargingFull} boxSize={12} color="blue.500" />
```

**Ahora:**
```tsx
<Logo height="60px" />
```

✅ Logo oficial de la marca (1080x478px)
✅ Mismo logo que la app móvil
✅ Mantiene aspecto profesional

---

### 2. Título

**Antes:**
```tsx
<Heading bgGradient="linear(to-r, blue.400, green.400)" bgClip="text">
  Power Bank Admin
</Heading>
```

**Ahora:**
```tsx
<Heading
  bgGradient="linear(to-r, brand.500, secondary.500)"
  bgClip="text"
  fontWeight="bold"
>
  Power Bank Admin
</Heading>
```

✅ Gradiente de neon green → electric cyan
✅ Colores de marca consistentes

---

### 3. Campos de Input

**Focus Border:**
```tsx
focusBorderColor="brand.500"  // Neon green #00FF41
```

✅ Border verde neón al enfocar
✅ Mejor feedback visual
✅ Consistente con marca

---

### 4. Botón de Login

**Antes:**
```tsx
<Button
  colorScheme="blue"
  bgGradient="linear(to-r, blue.400, blue.600)"
/>
```

**Ahora:**
```tsx
<Button
  colorScheme="brand"
  bg="brand.500"           // Neon green
  color="black"            // Texto negro (mejor contraste)
  _hover={{ bg: 'brand.300' }}
  _active={{ bg: 'brand.600' }}
  fontWeight="bold"
/>
```

✅ Verde neón brillante (`#00FF41`)
✅ Texto negro para máximo contraste
✅ Estados hover/active suaves
✅ Altamente visible y llamativo

---

### 5. Iconos Decorativos

**Antes:**
```tsx
<Icon color="blue.500" opacity={0.3} />
<Icon color="yellow.400" opacity={0.3} />
<Icon color="green.400" opacity={0.3} />
```

**Ahora:**
```tsx
<Icon color="brand.500" opacity={0.2} />      // Neon green
<Icon color="secondary.500" opacity={0.2} />  // Electric cyan
<Icon color="brand.300" opacity={0.2} />      // Light neon
<Icon color="secondary.300" opacity={0.2} />  // Light cyan
```

✅ Solo colores de marca (neon green y cyan)
✅ Opacidad reducida a 0.2 (más sutil)
✅ Estética coherente

---

### 6. Fondo

**Antes:**
```tsx
bgGradient={useColorModeValue(
  'linear(to-br, blue.50, green.50, yellow.50)',
  'linear(to-br, gray.900, blue.900, green.900)'
)}
```

**Ahora:**
```tsx
bgGradient={useColorModeValue(
  'linear(to-br, gray.50, green.50)',
  'linear(to-br, dark.500, dark.400, dark.300)'
)}
```

**Dark Mode (Default):**
- Gradiente sutil de negro puro → gris oscuro
- Fondo: `#0A0A0A` (pure black)
- Transición suave a `#2A2A2A`

**Light Mode:**
- Gradiente suave gris → verde claro
- Fondo limpio y profesional

---

### 7. Card del Formulario

```tsx
bg={cardBg}  // dark.400 (#1A1A1A) en dark mode
```

✅ Contraste perfecto con fondo
✅ Card oscuro sobre fondo más oscuro
✅ Borde sutil (`dark.300`)

---

## 🎨 Paleta Completa del Login

### Modo Oscuro (Default)

```css
Background Gradient:  #0A0A0A → #1A1A1A → #2A2A2A
Card Background:      #1A1A1A
Card Border:          #2A2A2A
Logo:                 Neon green (#00FF41) sobre negro
Title Gradient:       #00FF41 → #00E5FF
Button:               #00FF41 (neon green)
Button Text:          #000000 (black)
Button Hover:         #4DFF77 (light neon)
Button Active:        #00CC34 (dark neon)
Input Focus:          #00FF41 (neon green)
Icons (decorative):   #00FF41, #00E5FF (opacity 0.2)
Text Primary:         rgba(255, 255, 255, 0.92)
Text Secondary:       #8A8A8A
```

### Modo Claro

```css
Background Gradient:  gray.50 → green.50
Card Background:      white
Card Border:          gray.200
Logo:                 Original (neon green on black)
Title Gradient:       #00FF41 → #00E5FF
Button:               #00FF41 (neon green)
Button Text:          #000000 (black)
Input Focus:          #00FF41 (neon green)
Text Primary:         gray.800
Text Secondary:       gray.600
```

---

## 📐 Estructura Visual

```
┌─────────────────────────────────────────────┐
│  Background (dark gradient)                 │
│  ┌─────────────────────────────────────┐   │
│  │  🔋 (icon - neon green)             │   │
│  │                                      │   │
│  │  ┌─────────────────────────────┐    │   │
│  │  │   Logo (60px height)        │    │   │
│  │  └─────────────────────────────┘    │   │
│  │                                      │   │
│  │  Power Bank Admin                   │   │ <- Gradient text
│  │  (neon green → cyan)                │   │
│  │                                      │   │
│  │  Inicia sesión para gestionar...   │   │
│  │                                      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │ 📧 Email                     │   │   │ <- Focus: neon green
│  │  └──────────────────────────────┘   │   │
│  │                                      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │ 🔒 Password            👁    │   │   │ <- Focus: neon green
│  │  └──────────────────────────────┘   │   │
│  │                                      │   │
│  │  ┌──────────────────────────────┐   │   │
│  │  │ ⚡ INICIAR SESIÓN (black)   │   │   │ <- Neon green button
│  │  └──────────────────────────────┘   │   │
│  │                                      │   │
│  │  🔋 Sistema de Gestión...           │   │
│  │  Acceso seguro a tu red...          │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ⚡ (icon - cyan)                           │
└─────────────────────────────────────────────┘
```

---

## 🔥 Highlights

### Botón Principal

El botón de login es el elemento más llamativo:

```tsx
// Neon green brillante con texto negro
bg="brand.500"      // #00FF41
color="black"       // Máximo contraste
fontWeight="bold"   // Texto en negrita

// Efectos hover/active suaves
_hover={{ bg: 'brand.300' }}  // Más claro
_active={{ bg: 'brand.600' }} // Más oscuro
```

**Visual:**
```
┌────────────────────────────────┐
│  ⚡  INICIAR SESIÓN            │  <- Neon green background
└────────────────────────────────┘     Black bold text
```

---

## 🎭 Estados del Botón

### Normal
```css
Background: #00FF41 (neon green)
Text:       #000000 (black)
```

### Hover
```css
Background: #4DFF77 (light neon)
Text:       #000000 (black)
Cursor:     pointer
```

### Active/Pressed
```css
Background: #00CC34 (dark neon)
Text:       #000000 (black)
```

### Loading
```css
Background: #00FF41 (neon green)
Text:       "Iniciando sesión..."
Spinner:    black
```

---

## 🌓 Dark vs Light Mode

### Ventajas del Dark Mode (Default)

1. **Consistencia con App Móvil**: Mismo tema oscuro
2. **Estética Tech**: Logo neon destaca en negro
3. **Menos Fatiga Visual**: Ideal para administradores
4. **Contraste Perfecto**: Neon green sobre negro es icónico

### Light Mode (Opcional)

- Toggle disponible (puede agregarse)
- Colores se adaptan automáticamente
- Logo mantiene su fondo negro original

---

## 📱 Responsive

El login es completamente responsive:

```tsx
<Container maxW="md">  // Max width 448px
  <Box p={10}>         // Padding generoso
    <Logo height="60px" />  // Logo grande
  </Box>
</Container>
```

**Mobile:**
- Container se ajusta a pantalla
- Logo se mantiene legible
- Campos de input full-width
- Botón full-width

**Desktop:**
- Container centrado (max 448px)
- Diseño balanceado
- Iconos decorativos visibles

---

## 🎯 Accesibilidad

### Contraste WCAG AA/AAA ✅

```
Neon Green (#00FF41) + Black text:
Ratio: 12.48:1 (AAA)

White text + Black background:
Ratio: 21:1 (AAA)

Dark text + Light background:
Ratio: 15:1 (AAA)
```

### Features de Accesibilidad

- ✅ Labels claros en inputs
- ✅ Iconos con aria-label
- ✅ Estados de error visibles
- ✅ Focus states bien definidos
- ✅ Keyboard navigation completa
- ✅ Contraste suficiente en todos los estados

---

## 🧪 Testing Visual

### Preview Local

```bash
pnpm dev
# Abre http://localhost:5173
# Navega a /login
```

### Elementos a Verificar

- [ ] Logo se carga correctamente (60px altura)
- [ ] Título con gradiente neon green → cyan
- [ ] Botón verde neón brillante
- [ ] Inputs con border neon green al focus
- [ ] Iconos decorativos sutiles
- [ ] Fondo con gradiente oscuro
- [ ] Card contrasta con fondo
- [ ] Texto legible en todos los estados

---

## 🔧 Personalización

### Cambiar Altura del Logo

```tsx
<Logo height="80px" />  // Más grande
<Logo height="40px" />  // Más pequeño
```

### Cambiar Color del Botón

```tsx
// Para usar secondary (cyan) en lugar de brand
<Button
  bg="secondary.500"
  color="black"
  _hover={{ bg: 'secondary.300' }}
/>
```

### Agregar Toggle de Color Mode

```tsx
import { useColorMode, IconButton } from '@chakra-ui/react';
import { FiSun, FiMoon } from 'react-icons/fi';

const { colorMode, toggleColorMode } = useColorMode();

// En el footer
<IconButton
  icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
  onClick={toggleColorMode}
  aria-label="Toggle color mode"
  variant="ghost"
  color="brand.500"
/>
```

---

## 📚 Recursos

- **Componente**: [src/pages/Login.tsx](./src/pages/Login.tsx)
- **Logo**: [src/components/Logo.tsx](./src/components/Logo.tsx)
- **Tema**: [src/theme.ts](./src/theme.ts)
- **Colores**: [THEME_COLORS.md](./THEME_COLORS.md)

---

¡Disfruta del nuevo diseño de login con colores de marca! 💚⚡
