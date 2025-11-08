import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
  Image,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdDevices,
  MdBattery80,
  MdImage,
  MdGroup,
  MdCalendarToday,
  MdSettings,
} from 'react-icons/md';

interface NavItem {
  label: string;
  icon: typeof MdDashboard;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  { label: 'Gabinetes', icon: MdDevices, path: '/cabinets' },
  { label: 'Baterías', icon: MdBattery80, path: '/batteries' },
];

const screenNavItems: NavItem[] = [
  { label: 'Materiales', icon: MdImage, path: '/screen/materials' },
  { label: 'Grupos', icon: MdGroup, path: '/screen/groups' },
  { label: 'Planes', icon: MdCalendarToday, path: '/screen/plans' },
];

const settingsNavItems: NavItem[] = [
  { label: 'Configuración', icon: MdSettings, path: '/settings' },
];

export default function Sidebar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      w="260px"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      h="100vh"
      overflow="auto"
    >
      {/* Logo/Title */}
      <Flex h="70px" align="center" justify="center" borderBottom="1px" borderColor={borderColor} px={4}>
        <Image
          src="/logo.png"
          alt="Recargá"
          w="100%"
          h="auto"
          maxH="60px"
          objectFit="contain"
        />
      </Flex>

      {/* Navigation */}
      <VStack spacing={0} align="stretch" p={4}>
        {/* Main Navigation */}
        <VStack spacing={1} align="stretch">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </VStack>

        <Divider my={4} />

        {/* Screen Management Section */}
        <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={3}>
          PUBLICIDAD EN PANTALLAS
        </Text>
        <VStack spacing={1} align="stretch">
          {screenNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </VStack>

        <Divider my={4} />

        {/* Settings Section */}
        <VStack spacing={1} align="stretch">
          {settingsNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );
}

interface NavItemProps {
  label: string;
  icon: typeof MdDashboard;
  path: string;
}

function NavItem({ label, icon, path }: NavItemProps) {
  const activeColor = useColorModeValue('brand.600', 'brand.300');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <NavLink to={path}>
      {({ isActive }) => (
        <Flex
          align="center"
          p={3}
          borderRadius="md"
          cursor="pointer"
          bg={isActive ? activeBg : 'transparent'}
          color={isActive ? activeColor : 'inherit'}
          fontWeight={isActive ? 'semibold' : 'normal'}
          _hover={{
            bg: isActive ? activeBg : hoverBg,
          }}
          transition="all 0.2s"
        >
          <Icon as={icon} boxSize={5} mr={3} />
          <Text fontSize="sm">{label}</Text>
        </Flex>
      )}
    </NavLink>
  );
}
