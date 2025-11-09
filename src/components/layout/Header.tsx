import {
  Flex,
  Heading,
  IconButton,
  HStack,
  useColorMode,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { MdBrightness4, MdBrightness7, MdNotifications, MdPerson, MdLogout } from 'react-icons/md';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const location = useLocation();
  const { user, logout } = useAuth();
  const toast = useToast();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/cabinets')) return 'Gestión de Gabinetes';
    if (path.includes('/batteries')) return 'Monitoreo de Baterías';
    if (path.includes('/screen/materials')) return 'Materiales Publicitarios';
    if (path.includes('/screen/groups')) return 'Grupos Publicitarios';
    if (path.includes('/screen/plans')) return 'Planes Publicitarios';
    if (path.includes('/settings')) return 'Configuración del Sistema';
    return 'Dashboard';
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Hubo un error al cerrar sesión',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      as="header"
      h="70px"
      px={6}
      align="center"
      justify="space-between"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Heading size="md">{getPageTitle()}</Heading>

      <HStack spacing={3}>
        {/* Color Mode Toggle */}
        <IconButton
          aria-label={colorMode === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          icon={colorMode === 'light' ? <MdBrightness4 /> : <MdBrightness7 />}
          onClick={toggleColorMode}
          variant="ghost"
          size="md"
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'brand.500',
            outlineOffset: '2px',
          }}
        />

        {/* Notifications */}
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Notifications"
            icon={<MdNotifications />}
            variant="ghost"
            size="md"
            position="relative"
          >
            <Badge
              position="absolute"
              top="0"
              right="0"
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
            >
              3
            </Badge>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Text fontSize="sm">El gabinete CT123 está desconectado</Text>
            </MenuItem>
            <MenuItem>
              <Text fontSize="sm">Alerta de batería baja</Text>
            </MenuItem>
            <MenuItem>
              <Text fontSize="sm">Nuevo plan publicitario activo</Text>
            </MenuItem>
          </MenuList>
        </Menu>

        {/* User Menu */}
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              name={user?.fullName || user?.email || 'User'}
              src={user?.avatarUrl || undefined}
              icon={<MdPerson />}
              cursor="pointer"
            />
          </MenuButton>
          <MenuList>
            <MenuItem isDisabled>
              <Text fontSize="sm" fontWeight="bold">
                {user?.fullName || user?.email}
              </Text>
            </MenuItem>
            <MenuItem isDisabled>
              <Text fontSize="xs" color="gray.500">
                {user?.email}
              </Text>
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<MdPerson />}>Perfil</MenuItem>
            <MenuItem>Configuración de Cuenta</MenuItem>
            <MenuDivider />
            <MenuItem color="red.500" icon={<MdLogout />} onClick={handleLogout}>
              Cerrar Sesión
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  );
}
