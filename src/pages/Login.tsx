import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  IconButton,
  FormErrorMessage,
  Flex,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from '@chakra-ui/icons';
import { MdBatteryChargingFull, MdPower, MdElectricBolt } from 'react-icons/md';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const toast = useToast();

  // Theme colors - Using neon green brand colors
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, green.50)',
    'linear(to-br, dark.500, dark.400, dark.300)'
  );
  const cardBg = useColorModeValue('white', 'dark.400');
  const iconColor = useColorModeValue('brand.500', 'brand.300');

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login({ email, password });

      toast({
        title: 'Inicio de sesión exitoso',
        description: '¡Bienvenido de nuevo!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Login error:', error);

      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Credenciales inválidas',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" bgGradient={bgGradient} align="center" justify="center" position="relative">
      {/* Decorative Power Icons - Using brand colors */}
      <Icon
        as={MdBatteryChargingFull}
        position="absolute"
        top="10%"
        left="10%"
        boxSize={12}
        color="brand.500"
        opacity={0.2}
        transform="rotate(-15deg)"
      />
      <Icon
        as={MdElectricBolt}
        position="absolute"
        top="20%"
        right="15%"
        boxSize={10}
        color="secondary.500"
        opacity={0.2}
        transform="rotate(25deg)"
      />
      <Icon
        as={MdPower}
        position="absolute"
        bottom="15%"
        left="15%"
        boxSize={10}
        color="brand.300"
        opacity={0.2}
        transform="rotate(-10deg)"
      />
      <Icon
        as={MdBatteryChargingFull}
        position="absolute"
        bottom="20%"
        right="10%"
        boxSize={12}
        color="secondary.300"
        opacity={0.2}
        transform="rotate(15deg)"
      />

      <Container maxW="md">
        <Box
          bg={cardBg}
          p={10}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <VStack spacing={8} align="stretch">
            {/* Logo and Title Section */}
            <VStack spacing={4}>
              <Logo height="60px" />
              <Heading
                size="xl"
                textAlign="center"
                bgGradient="linear(to-r, brand.500, secondary.500)"
                bgClip="text"
                fontWeight="bold"
              >
                Power Bank Admin
              </Heading>
              <Text
                color={useColorModeValue('gray.600', 'dark.50')}
                textAlign="center"
                fontSize="md"
              >
                Inicia sesión para gestionar tu red de power banks
              </Text>
            </VStack>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="semibold">Correo Electrónico</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder="tu.correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      size="lg"
                      focusBorderColor="brand.500"
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="semibold">Contraseña</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      size="lg"
                      focusBorderColor="brand.500"
                      pl={10}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  width="full"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Iniciando sesión..."
                  mt={4}
                  bg="brand.500"
                  color="black"
                  _hover={{
                    bg: 'brand.300',
                  }}
                  _active={{
                    bg: 'brand.600',
                  }}
                  leftIcon={<Icon as={MdElectricBolt} />}
                  fontWeight="bold"
                >
                  Iniciar Sesión
                </Button>
              </VStack>
            </form>

            {/* Footer */}
            <VStack spacing={2} pt={4}>
              <Flex align="center" gap={2}>
                <Icon as={MdBatteryChargingFull} color="brand.500" />
                <Text
                  fontSize="sm"
                  color={useColorModeValue('gray.600', 'dark.50')}
                  fontWeight="medium"
                >
                  Sistema de Gestión de Power Banks
                </Text>
              </Flex>
              <Text fontSize="xs" color={useColorModeValue('gray.500', 'dark.100')}>
                Acceso seguro a tu red de carga
              </Text>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
}
