import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    // Neon Green - Primary Brand Color (from mobile app)
    brand: {
      50: '#E6FFF0',  // Very light neon green
      100: '#B3FFCC', // Light neon green
      200: '#80FFAA', // Lighter neon green
      300: '#4DFF77', // Light variant (from mobile)
      400: '#26FF5C', // Medium neon green
      500: '#00FF41', // Main neon green (mobile primary)
      600: '#00CC34', // Dark variant (from mobile)
      700: '#00A62B', // Darker neon green
      800: '#008022', // Very dark neon green
      900: '#005916', // Darkest neon green
    },
    // Electric Cyan - Secondary Color (from mobile app)
    secondary: {
      50: '#E6FEFF',
      100: '#B3FCFF',
      200: '#80F9FF',
      300: '#4DF6FF',
      400: '#26F3FF',
      500: '#00E5FF', // Main electric cyan (mobile secondary)
      600: '#00B8D4', // Dark variant (from mobile)
      700: '#0097B2',
      800: '#007690',
      900: '#00546E',
    },
    // Dark Theme Colors (from mobile app)
    dark: {
      50: '#8A8A8A',  // Light gray (from mobile)
      100: '#4A4A4A', // Medium gray (from mobile)
      200: '#3A3A3A', // Light surface (from mobile)
      300: '#2A2A2A', // Medium surface / Tertiary background (from mobile)
      400: '#1A1A1A', // Dark gray / Secondary background (from mobile)
      500: '#0A0A0A', // Pure black / Primary background (from mobile)
      600: '#000000', // Absolute black
      700: '#000000',
      800: '#000000',
      900: '#000000',
    },
    // Status Colors (from mobile app)
    success: {
      500: '#00FF41', // Neon green (same as brand)
    },
    error: {
      500: '#FF1744', // Bright red (from mobile)
    },
    warning: {
      500: '#FFD600', // Bright yellow (from mobile)
    },
    info: {
      500: '#00E5FF', // Electric cyan (same as secondary)
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'dark.500' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'brand',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
          color: props.colorScheme === 'brand' ? 'black' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? 'brand.300' : undefined,
          },
          _active: {
            bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'dark.400' : 'white',
          borderColor: props.colorMode === 'dark' ? 'dark.300' : 'gray.200',
        },
      }),
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: (props: any) => ({
        color: props.colorMode === 'dark' ? 'whiteAlpha.800' : 'gray.700',
      }),
    },
  },
  semanticTokens: {
    colors: {
      'chakra-body-bg': { _light: 'gray.50', _dark: 'dark.500' },
      'chakra-border-color': { _light: 'gray.200', _dark: 'dark.300' },
      'chakra-placeholder-color': { _light: 'gray.500', _dark: 'dark.50' },
    },
  },
});

export default theme;
