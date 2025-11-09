import { Box, Skeleton, SkeletonCircle, SkeletonText, VStack, HStack } from '@chakra-ui/react';

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <VStack spacing={3} align="stretch">
      {Array.from({ length: rows }).map((_, index) => (
        <HStack key={index} spacing={4}>
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="20%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="20%" />
          <Skeleton height="20px" width="15%" />
          <Skeleton height="20px" width="15%" />
        </HStack>
      ))}
    </VStack>
  );
}

export function CardSkeleton() {
  return (
    <Box borderWidth={1} borderRadius="lg" p={6}>
      <HStack spacing={4}>
        <SkeletonCircle size="12" />
        <VStack align="start" flex={1} spacing={2}>
          <Skeleton height="20px" width="60%" />
          <Skeleton height="16px" width="40%" />
        </VStack>
      </HStack>
    </Box>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </>
  );
}

export function CabinetCardSkeleton() {
  return (
    <Box borderWidth={1} borderRadius="md" p={3}>
      <HStack justify="space-between">
        <VStack align="start" spacing={2} flex={1}>
          <Skeleton height="20px" width="50%" />
          <HStack spacing={2}>
            <Skeleton height="16px" width="60px" />
            <Skeleton height="16px" width="40px" />
          </HStack>
        </VStack>
        <VStack align="end" spacing={1}>
          <Skeleton height="14px" width="80px" />
          <Skeleton height="14px" width="60px" />
        </VStack>
      </HStack>
    </Box>
  );
}

export function SlotGridSkeleton({ slots = 8 }: { slots?: number }) {
  return (
    <>
      {Array.from({ length: slots }).map((_, index) => (
        <Box key={index} borderWidth={2} borderRadius="md" p={4}>
          <VStack spacing={3}>
            <HStack justify="space-between" w="full">
              <Skeleton height="20px" width="30px" />
              <SkeletonCircle size="5" />
            </HStack>
            <SkeletonCircle size="12" />
            <Skeleton height="16px" width="60%" />
            <Skeleton height="32px" width="100%" />
          </VStack>
        </Box>
      ))}
    </>
  );
}

export function DetailsSkeleton() {
  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between">
        <HStack spacing={4}>
          <Skeleton height="32px" width="100px" />
          <Skeleton height="32px" width="150px" />
        </HStack>
        <HStack spacing={2}>
          <Skeleton height="40px" width="120px" />
          <Skeleton height="40px" width="120px" />
        </HStack>
      </HStack>

      {/* Stats Cards */}
      <HStack spacing={4}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} flex={1} borderWidth={1} borderRadius="lg" p={4}>
            <SkeletonText noOfLines={3} spacing={2} />
          </Box>
        ))}
      </HStack>

      {/* Content */}
      <Box borderWidth={1} borderRadius="lg" p={6}>
        <SkeletonText noOfLines={4} spacing={4} />
      </Box>
    </VStack>
  );
}
