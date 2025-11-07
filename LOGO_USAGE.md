# 🎨 Guía de Uso del Logo - Power Bank Admin

Logo oficial sincronizado con la aplicación móvil.

## 📁 Archivos de Logo

### Logo Principal
```
/public/logo.png
```
- **Tamaño**: 1080 x 478 px
- **Formato**: PNG con transparencia (RGBA)
- **Uso**: Navbar, pantallas de login, splash screens
- **Colores**: Neon green (#00FF41) sobre fondo negro

### Favicon
```
/public/favicon.png
```
- **Tamaño**: Optimizado para navegadores
- **Formato**: PNG
- **Uso**: Tab del navegador, bookmarks

---

## 🎯 Componente Logo

### Importación

```tsx
import { Logo } from '@/components';
// o
import { Logo } from '@/components/Logo';
```

### Uso Básico

```tsx
// Logo completo (default)
<Logo />

// Logo con altura personalizada
<Logo height="50px" />

// Logo en modo icono (más pequeño)
<Logo variant="icon" />
```

---

## 📐 Variantes

### 1. Logo Completo (Default)

Para usar en navbar y headers:

```tsx
<Logo variant="full" height="40px" />
```

**Características:**
- Altura por defecto: 40px
- Ancho: Automático (mantiene aspect ratio)
- Mejor para: Navbar, headers, pantallas principales

### 2. Logo Icono

Para espacios más pequeños:

```tsx
<Logo variant="icon" height="32px" />
```

**Características:**
- Altura por defecto: 32px
- Más compacto
- Mejor para: Sidebars, mobile, espacios reducidos

---

## 💡 Ejemplos de Uso

### En Navbar

```tsx
import { Box, Flex } from '@chakra-ui/react';
import { Logo } from '@/components';

const Navbar = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      padding={4}
      bg="dark.400"
      borderBottom="1px"
      borderColor="dark.300"
    >
      <Logo height="40px" />
      {/* Resto del navbar */}
    </Flex>
  );
};
```

### En Login Page

```tsx
import { VStack, Heading } from '@chakra-ui/react';
import { Logo } from '@/components';

const LoginPage = () => {
  return (
    <VStack spacing={8}>
      <Logo height="60px" />
      <Heading size="lg">Iniciar Sesión</Heading>
      {/* Formulario */}
    </VStack>
  );
};
```

### En Sidebar

```tsx
import { Box } from '@chakra-ui/react';
import { Logo } from '@/components';

const Sidebar = () => {
  return (
    <Box bg="dark.400" p={4}>
      <Logo variant="icon" height="32px" mb={6} />
      {/* Menú */}
    </Box>
  );
};
```

### Como Link

```tsx
import { Link } from 'react-router-dom';
import { Logo } from '@/components';

<Link to="/">
  <Logo height="40px" cursor="pointer" />
</Link>
```

---

## 🎨 Personalización

### Props Disponibles

El componente `Logo` acepta todas las props de `Image` de Chakra UI:

```tsx
interface LogoProps {
  variant?: 'full' | 'icon';  // Variante del logo
  height?: string;             // Altura personalizada
  width?: string;              // Ancho (auto por defecto)
  cursor?: string;             // Cursor (ej: 'pointer')
  opacity?: number;            // Opacidad
  filter?: string;             // Filtros CSS
  // ... todas las props de Image
}
```

### Ejemplos de Personalización

```tsx
// Logo con cursor pointer (clickeable)
<Logo cursor="pointer" />

// Logo con opacidad reducida
<Logo opacity={0.8} />

// Logo con transición hover
<Logo
  cursor="pointer"
  transition="opacity 0.2s"
  _hover={{ opacity: 0.8 }}
/>

// Logo con tamaño responsive
<Logo
  height={{ base: '30px', md: '40px', lg: '50px' }}
/>
```

---

## 🌓 Dark vs Light Mode

### Dark Mode (Default)

El logo se ve perfecto en dark mode con su fondo negro natural:

```tsx
<Box bg="dark.500" p={4}>
  <Logo height="40px" />
</Box>
```

### Light Mode

Para light mode, puedes agregar un contenedor con fondo:

```tsx
<Box
  bg={colorMode === 'light' ? 'black' : 'transparent'}
  borderRadius="md"
  p={2}
  display="inline-block"
>
  <Logo height="40px" />
</Box>
```

O usar un logo invertido (si lo tienes):

```tsx
const logoSrc = colorMode === 'dark' ? '/logo.png' : '/logo-light.png';

<Image src={logoSrc} alt="Logo" height="40px" />
```

---

## 📱 Responsive

### Tamaños por Breakpoint

```tsx
<Logo
  height={{
    base: '30px',   // Mobile
    sm: '35px',     // Small tablets
    md: '40px',     // Desktop
    lg: '45px',     // Large screens
    xl: '50px',     // Extra large
  }}
/>
```

### Ocultar en Mobile

```tsx
<Logo
  display={{ base: 'none', md: 'block' }}
  height="40px"
/>
```

### Variante por Breakpoint

```tsx
const isMobile = useBreakpointValue({ base: true, md: false });

<Logo variant={isMobile ? 'icon' : 'full'} />
```

---

## 🎯 Best Practices

### ✅ Hacer

- Usar `height` y dejar `width="auto"` para mantener aspect ratio
- Usar `variant="icon"` en espacios pequeños
- Agregar `cursor="pointer"` si es clickeable
- Usar tamaños responsive en mobile

### ❌ Evitar

- No estirar el logo (mantén aspect ratio)
- No usar tamaños muy pequeños (< 24px)
- No cambiar los colores del logo (usa el original)
- No rotar o distorsionar el logo

---

## 🔧 Troubleshooting

### Logo no se muestra

**Verificar:**
1. Archivo existe en `/public/logo.png`
2. Path correcto en el componente
3. Build incluye la carpeta public

```bash
# Verificar archivo
ls public/logo.png

# Rebuild
pnpm run build
```

### Logo muy grande/pequeño

```tsx
// Ajustar altura
<Logo height="40px" />

// O usar tamaño responsive
<Logo height={{ base: '30px', md: '40px' }} />
```

### Logo borroso

**Causa:** Tamaño muy grande o DPI bajo

**Solución:**
- El logo original es 1080x478 (alta calidad)
- Usa tamaños razonables (30-60px de altura)
- Para tamaños más grandes, considera usar SVG

---

## 📏 Especificaciones Técnicas

### Logo Principal (logo.png)

```
Dimensiones:    1080 x 478 px
Aspect Ratio:   2.26:1 (aproximadamente 9:4)
Formato:        PNG
Profundidad:    8-bit RGBA (con transparencia)
Tamaño:         ~99 KB
Colores:        Neon green (#00FF41) sobre negro
```

### Favicon (favicon.png)

```
Formato:        PNG
Uso:            Browser tab icon
Tamaño:         Optimizado para navegadores
```

---

## 🎨 Colores del Logo

El logo usa los mismos colores del sistema:

- **Primary**: `#00FF41` - Neon Green
- **Background**: `#0A0A0A` - Pure Black
- **Accents**: Variantes de neon green

Estos colores ya están definidos en el tema como `brand.500` y `dark.500`.

---

## 📦 Integración con Vercel

Los assets en `/public` se copian automáticamente al deploy:

```
public/
├── logo.png      ✅ Se despliega
├── favicon.png   ✅ Se despliega
└── ...
```

**No requiere configuración adicional.**

---

## 🔄 Actualizar Logo

Si necesitas actualizar el logo:

1. Reemplaza `/public/logo.png`
2. Mantén el mismo nombre y formato
3. Rebuild:
   ```bash
   pnpm run build
   ```
4. Deploy automáticamente reflejará cambios

---

## 📚 Recursos

- **Logo original**: `mobile/assets/logo.png`
- **Componente**: `src/components/Logo.tsx`
- **Chakra Image Docs**: https://chakra-ui.com/docs/components/image

---

¡Disfruta usando el logo! 💚
