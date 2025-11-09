import { Box, useBreakpointValue, VStack, HStack, Text, Badge } from '@chakra-ui/react';
import type { Cabinet } from '@/types/api.types';

interface ResponsiveCabinetCardProps {
  cabinet: Cabinet;
  onClick: () => void;
  children?: React.ReactNode;
}

export function ResponsiveCabinetCard({ cabinet, onClick, children }: ResponsiveCabinetCardProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!isMobile) return null;

  return (
    <Box
      borderWidth={1}
      borderRadius="md"
      p={4}
      onClick={onClick}
      cursor="pointer"
      _hover={{ bg: 'gray.50', _dark: { bg: 'gray.700' } }}
      transition="all 0.2s"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">
            {cabinet.cabinet_id}
          </Text>
          <Badge colorScheme={cabinet.is_online === 1 ? 'green' : 'red'}>
            {cabinet.is_online === 1 ? 'En Línea' : 'Offline'}
          </Badge>
        </HStack>

        <HStack justify="space-between">
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            Modelo:
          </Text>
          <Badge colorScheme="blue">{cabinet.model.toUpperCase()}</Badge>
        </HStack>

        {cabinet.signalStrength && (
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              Señal:
            </Text>
            <Badge
              colorScheme={
                cabinet.signalStrength >= 20
                  ? 'green'
                  : cabinet.signalStrength >= 10
                    ? 'yellow'
                    : 'red'
              }
            >
              {cabinet.signalStrength}/31
            </Badge>
          </HStack>
        )}

        {cabinet.address && (
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} noOfLines={1}>
            📍 {cabinet.address}
          </Text>
        )}

        {children}
      </VStack>
    </Box>
  );
}
