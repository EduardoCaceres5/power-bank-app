import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
  useColorModeValue,
  Divider,
  Image,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  Tooltip,
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
  MdMenu,
  MdChevronLeft,
  MdChevronRight,
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <Box
      w={collapsed ? '70px' : '260px'}
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      h="100vh"
      overflow="auto"
      transition="width 0.2s"
    >
      {/* Logo/Title */}
      <Flex
        h="70px"
        align="center"
        justify="center"
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        position="relative"
      >
        {!collapsed && (
          <Image
            src="/logo.png"
            alt="Recargá"
            w="100%"
            h="auto"
            maxH="60px"
            objectFit="contain"
          />
        )}
        {!isMobile && (
          <IconButton
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            icon={collapsed ? <MdChevronRight /> : <MdChevronLeft />}
            onClick={() => setIsCollapsed(!collapsed)}
            variant="ghost"
            size="sm"
            position="absolute"
            right={2}
          />
        )}
      </Flex>

      {/* Navigation */}
      <VStack spacing={0} align="stretch" p={4}>
        {/* Main Navigation */}
        <VStack spacing={1} align="stretch">
          {navItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </VStack>

        <Divider my={4} />

        {/* Screen Management Section */}
        {!collapsed && (
          <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={2} px={3}>
            PUBLICIDAD EN PANTALLAS
          </Text>
        )}
        <VStack spacing={1} align="stretch">
          {screenNavItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </VStack>

        <Divider my={4} />

        {/* Settings Section */}
        <VStack spacing={1} align="stretch">
          {settingsNavItems.map((item) => (
            <NavItem key={item.path} {...item} collapsed={collapsed} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="Abrir menú"
          icon={<MdMenu />}
          onClick={onOpen}
          position="fixed"
          top={4}
          left={4}
          zIndex={20}
          colorScheme="brand"
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent maxW="260px">
            <SidebarContent />
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return <SidebarContent collapsed={isCollapsed} />;
}

interface NavItemProps {
  label: string;
  icon: typeof MdDashboard;
  path: string;
  collapsed?: boolean;
}

function NavItem({ label, icon, path, collapsed = false }: NavItemProps) {
  const activeColor = useColorModeValue('brand.600', 'brand.300');
  const activeBg = useColorModeValue('brand.50', 'brand.900');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <NavLink to={path}>
      {({ isActive }) => {
        const content = (
          <Flex
            align="center"
            justify={collapsed ? 'center' : 'flex-start'}
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
            <Icon as={icon} boxSize={5} mr={collapsed ? 0 : 3} />
            {!collapsed && <Text fontSize="sm">{label}</Text>}
          </Flex>
        );

        return collapsed ? (
          <Tooltip label={label} placement="right">
            {content}
          </Tooltip>
        ) : (
          content
        );
      }}
    </NavLink>
  );
}
