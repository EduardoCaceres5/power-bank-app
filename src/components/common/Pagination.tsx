import { HStack, Button, Text, IconButton, Select, useColorModeValue } from '@chakra-ui/react';
import { MdChevronLeft, MdChevronRight, MdFirstPage, MdLastPage } from 'react-icons/md';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 20,
  onPageSizeChange,
  totalItems,
}: PaginationProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('brand.500', 'brand.300');

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <HStack spacing={4} justify="space-between" flexWrap="wrap">
      <HStack spacing={2}>
        <IconButton
          aria-label="Primera página"
          icon={<MdFirstPage />}
          onClick={() => onPageChange(1)}
          isDisabled={currentPage === 1}
          size="sm"
          variant="ghost"
        />
        <IconButton
          aria-label="Página anterior"
          icon={<MdChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          size="sm"
          variant="ghost"
        />

        <HStack spacing={1}>
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <Text key={`ellipsis-${index}`} px={2}>
                ...
              </Text>
            ) : (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? 'solid' : 'ghost'}
                colorScheme={page === currentPage ? 'brand' : 'gray'}
                onClick={() => onPageChange(page as number)}
                minW="32px"
              >
                {page}
              </Button>
            )
          )}
        </HStack>

        <IconButton
          aria-label="Página siguiente"
          icon={<MdChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          size="sm"
          variant="ghost"
        />
        <IconButton
          aria-label="Última página"
          icon={<MdLastPage />}
          onClick={() => onPageChange(totalPages)}
          isDisabled={currentPage === totalPages}
          size="sm"
          variant="ghost"
        />
      </HStack>

      {totalItems !== undefined && (
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
            Mostrando {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, totalItems)} de {totalItems}
          </Text>
          {onPageSizeChange && (
            <HStack spacing={2}>
              <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                Por página:
              </Text>
              <Select
                size="sm"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                maxW="80px"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </HStack>
          )}
        </HStack>
      )}
    </HStack>
  );
}
