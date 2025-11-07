import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <Box flex="1" overflow="auto" bg={bgColor} p={6}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
