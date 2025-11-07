import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useColorModeValue,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';

export default function Settings() {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box>
      <Tabs colorScheme="brand">
        <TabList>
          <Tab>Energía de Batería</Tab>
          <Tab>Webhook</Tab>
          <Tab>Configuración de Código QR</Tab>
          <Tab>Valores Predeterminados de Pantalla</Tab>
        </TabList>

        <TabPanels>
          {/* Battery Power Settings */}
          <TabPanel>
            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Configuración de Energía Mínima de Batería
              </Heading>
              <Text mb={4} color="gray.500">
                Establezca el nivel mínimo de energía de batería requerido para el alquiler
              </Text>
              <Divider mb={6} />

              <VStack spacing={4} align="stretch" maxW="500px">
                <FormControl>
                  <FormLabel>Energía Mínima (%)</FormLabel>
                  <Input type="number" placeholder="80" />
                </FormControl>

                <Button colorScheme="brand" mt={4}>
                  Guardar Configuración
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* Webhook Settings */}
          <TabPanel>
            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Configuración de Webhook
              </Heading>
              <Text mb={4} color="gray.500">
                Configure la URL del webhook para notificaciones de devolución de power bank
              </Text>
              <Divider mb={6} />

              <VStack spacing={4} align="stretch" maxW="500px">
                <FormControl>
                  <FormLabel>URL del Webhook</FormLabel>
                  <Input type="url" placeholder="https://example.com/webhook" />
                </FormControl>

                <Button colorScheme="brand" mt={4}>
                  Guardar Webhook
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* QR Code Settings */}
          <TabPanel>
            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Configuración de Código QR
              </Heading>
              <Text mb={4} color="gray.500">
                Personalice la apariencia del código QR
              </Text>
              <Divider mb={6} />

              <VStack spacing={4} align="stretch" maxW="500px">
                <FormControl>
                  <FormLabel>Color del Código QR</FormLabel>
                  <Input type="color" />
                </FormControl>

                <Button colorScheme="brand" mt={4}>
                  Guardar Configuración
                </Button>
              </VStack>
            </Box>
          </TabPanel>

          {/* Screen Defaults */}
          <TabPanel>
            <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
              <Heading size="md" mb={4}>
                Imágenes Predeterminadas de Pantalla
              </Heading>
              <Text mb={4} color="gray.500">
                Configure las imágenes predeterminadas de la pantalla para diferentes estados
              </Text>
              <Divider mb={6} />

              <VStack spacing={4} align="stretch" maxW="500px">
                <Text fontWeight="semibold">Próximamente...</Text>
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
