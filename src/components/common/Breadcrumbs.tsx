import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { MdChevronRight, MdHome } from 'react-icons/md';

interface BreadcrumbRoute {
  path: string;
  label: string;
  icon?: typeof MdHome;
}

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  cabinets: 'Gabinetes',
  batteries: 'Baterías',
  screen: 'Publicidad',
  materials: 'Materiales',
  groups: 'Grupos',
  plans: 'Planes',
  settings: 'Configuración',
};

export function Breadcrumbs() {
  const location = useLocation();
  const linkColor = useColorModeValue('gray.600', 'gray.400');
  const activeLinkColor = useColorModeValue('brand.600', 'brand.300');

  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbRoute[] = [
    { path: '/dashboard', label: 'Inicio', icon: MdHome },
  ];

  let currentPath = '';
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeLabels[segment] || segment;

    // Skip numeric IDs in breadcrumbs (like cabinet IDs)
    if (!/^\d+$/.test(segment)) {
      breadcrumbs.push({
        path: currentPath,
        label: label.charAt(0).toUpperCase() + label.slice(1),
      });
    }
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb
      spacing={2}
      separator={<Icon as={MdChevronRight} color={linkColor} />}
      fontSize="sm"
      mb={4}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <BreadcrumbItem key={crumb.path} isCurrentPage={isLast}>
            <BreadcrumbLink
              as={RouterLink}
              to={crumb.path}
              color={isLast ? activeLinkColor : linkColor}
              fontWeight={isLast ? 'semibold' : 'normal'}
              _hover={{ textDecoration: 'underline' }}
            >
              {crumb.icon && <Icon as={crumb.icon} mr={1} />}
              {crumb.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}
