```typescript
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  HStack,
  Text,
  useToast,
  Spinner,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

// ... (previous interfaces remain same)

interface ProfileCard {
  id: string;
  description: string;
  source: string;
  role: string;
  style: string;
  division?: string[];
}

const AVAILABLE_DIVISIONS = [
  'Global Technology',
  'Investment Engine',
  'Enterprise Architecture',
  'Cloud Engineering',
  'Product Engineering',
  'Data Engineering',
  'Security Engineering'
];

const CardContentEditor: React.FC = () => {
  // ... (previous state declarations remain same)

  const [newProfileCard, setNewProfileCard] = useState<ProfileCard>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default',
    division: []
  });

  const handleDivisionToggle = (division: string) => {
    setNewProfileCard(prev => {
      const currentDivisions = prev.division || [];
      if (currentDivisions.includes(division)) {
        return {
          ...prev,
          division: currentDivisions.filter(d => d !== division)
        };
      } else {
        return {
          ...prev,
          division: [...currentDivisions, division]
        };
      }
    });
  };

  const renderCardForm = () => {
    if (activeTab === 'profileTypes') {
      return (
        <Stack spacing={4}>
          <FormControl isRequired>
            <FormLabel>ID</FormLabel>
            <Input
              value={newProfileCard.id}
              onChange={e => setNewProfileCard({...newProfileCard, id: e.target.value})}
              placeholder="dev007"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              value={newProfileCard.description}
              onChange={e => setNewProfileCard({...newProfileCard, description: e.target.value})}
              placeholder="Enter description"
            />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Source</FormLabel>
            <Input
              value={newProfileCard.source}
              onChange={e => setNewProfileCard({...newProfileCard, source: e.target.value})}
              placeholder="Enter source"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Divisions</FormLabel>
            <Menu closeOnSelect={false}>
              <MenuButton 
                as={Button} 
                rightIcon={<ChevronDownIcon />}
                w="full"
                textAlign="left"
              >
                {newProfileCard.division?.length 
                  ? `${newProfileCard.division.length} selected`
                  : 'Select divisions'}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type="checkbox" value={newProfileCard.division}>
                  {AVAILABLE_DIVISIONS.map(division => (
                    <MenuItemOption
                      key={division}
                      value={division}
                      onClick={() => handleDivisionToggle(division)}
                    >
                      {division}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
            {newProfileCard.division && newProfileCard.division.length > 0 && (
              <Box mt={2} p={2} borderWidth="1px" borderRadius="md">
                <Text fontWeight="bold" mb={2}>Selected Divisions:</Text>
                <Stack>
                  {newProfileCard.division.map((div, index) => (
                    <HStack key={index} justify="space-between">
                      <Text>{div}</Text>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={() => handleDivisionToggle(div)}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </Stack>
              </Box>
            )}
          </FormControl>
        </Stack>
      );
    }

    // ... (rest of renderCardForm remains same)
  };

  const renderCards = () => {
    if (!data || !selectedType) return null;

    switch (activeTab) {
      case 'profileTypes':
        const profileType = data.cardContent.profileTypes.find(
          type => type.type === selectedType
        );
        return profileType?.cards.map((card, index) => (
          <HStack key={index} p={4} borderWidth="1px" borderRadius="md" align="flex-start">
            <Box flex="1">
              <Text fontWeight="bold">ID: {card.id}</Text>
              <Text>Description: {card.description}</Text>
              <Text>Source: {card.source}</Text>
              {card.division && card.division.length > 0 && (
                <Box mt={2}>
                  <Text fontWeight="bold">Divisions:</Text>
                  <Stack ml={4}>
                    {card.division.map((div, idx) => (
                      <Text key={idx}>• {div}</Text>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
            <Button
              colorScheme="red"
              size="sm"
              onClick={() => handleDeleteCard(card)}
            >
              Delete
            </Button>
          </HStack>
        ));

      // ... (rest of renderCards remains same)
    }
  };

  // ... (rest of component remains same)
};

export default CardContentEditor;
```
