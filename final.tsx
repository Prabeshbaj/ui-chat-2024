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
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  ButtonGroup,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface ProfileCard {
  id: string;
  description: string;
  source: string;
  role: string;
  style: string;
  division?: string[];
}

interface ProfileType {
  type: string;
  cards: ProfileCard[];
}

interface CardContent {
  cardContent: {
    profileTypes: ProfileType[];
    homeCards: any[]; // Preserve structure but not editing
    guidelines: any[]; // Preserve structure but not editing
  };
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
  const [originalData, setOriginalData] = useState<CardContent | null>(null);
  const [data, setData] = useState<CardContent | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const [newCard, setNewCard] = useState<ProfileCard>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default',
    division: []
  });

  useEffect(() => {
    fetchCardContent();
  }, []);

  useEffect(() => {
    if (data && data.cardContent.profileTypes.length > 0) {
      setSelectedType(data.cardContent.profileTypes[0].type);
    }
  }, [data]);

  useEffect(() => {
    if (originalData && data) {
      setHasChanges(JSON.stringify(originalData) !== JSON.stringify(data));
    }
  }, [data, originalData]);

  const fetchCardContent = async () => {
    try {
      const response = await fetch('/api/cardContent');
      const jsonData: CardContent = await response.json();
      setOriginalData(JSON.parse(JSON.stringify(jsonData)));
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      toast({
        title: 'Error fetching content',
        status: 'error',
        duration: 3000,
      });
      setLoading(false);
    }
  };

  const handleDivisionToggle = (division: string) => {
    setNewCard(prev => {
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

  const handleAddCard = () => {
    if (!data || !selectedType) return;

    if (!newCard.id || !newCard.description || !newCard.source) {
      toast({
        title: 'Required fields missing',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const updatedData = { ...data };
    const typeIndex = updatedData.cardContent.profileTypes.findIndex(
      type => type.type === selectedType
    );

    if (typeIndex !== -1) {
      updatedData.cardContent.profileTypes[typeIndex].cards.push(newCard);
      setData(updatedData);
      setNewCard({
        id: '',
        description: '',
        source: '',
        role: 'DevAssist',
        style: 'default',
        division: []
      });
      toast({
        title: 'Card added',
        status: 'success',
        duration: 2000,
      });
    }
  };

  const handleDeleteCard = (cardToDelete: ProfileCard) => {
    if (!data || !selectedType) return;

    const updatedData = { ...data };
    const typeIndex = updatedData.cardContent.profileTypes.findIndex(
      type => type.type === selectedType
    );

    if (typeIndex !== -1) {
      updatedData.cardContent.profileTypes[typeIndex].cards = 
        updatedData.cardContent.profileTypes[typeIndex].cards.filter(
          card => card.id !== cardToDelete.id
        );
      setData(updatedData);
      toast({
        title: 'Card deleted',
        status: 'info',
        duration: 2000,
      });
    }
  };

  const handleApplyChanges = async () => {
    if (!data || !hasChanges) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/cardContent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Sends complete JSON including homeCards and guidelines
      });
      
      if (!response.ok) throw new Error('Failed to update content');
      
      setOriginalData(JSON.parse(JSON.stringify(data)));
      setHasChanges(false);
      toast({
        title: 'Changes saved successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to save changes',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    if (originalData) {
      setData(JSON.parse(JSON.stringify(originalData)));
      setHasChanges(false);
      toast({
        title: 'Changes discarded',
        status: 'info',
        duration: 2000,
      });
    }
  };

  if (loading) return <Center h="200px"><Spinner size="xl" /></Center>;
  if (!data) return <Center h="200px"><Text>No data available</Text></Center>;

  return (
    <Card maxW="2xl" w="full">
      <CardHeader>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Card Editor</Heading>
          <ButtonGroup>
            <Button
              colorScheme="red"
              variant="ghost"
              onClick={handleDiscardChanges}
              isDisabled={!hasChanges}
            >
              Discard Changes
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApplyChanges}
              isDisabled={!hasChanges}
              isLoading={isSaving}
            >
              Apply Changes
            </Button>
          </ButtonGroup>
        </HStack>

        {hasChanges && (
          <Alert status="info" mb={4}>
            <AlertIcon />
            You have unsaved changes. Click "Apply Changes" to save them.
          </Alert>
        )}

        <FormControl mt={4}>
          <FormLabel>Select Profile Type</FormLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {data.cardContent.profileTypes.map(type => (
              <option key={type.type} value={type.type}>
                {type.type}
              </option>
            ))}
          </Select>
        </FormControl>
      </CardHeader>

      <CardBody>
        <Stack spacing={6}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Add New Card</Heading>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ID</FormLabel>
                <Input
                  value={newCard.id}
                  onChange={e => setNewCard({...newCard, id: e.target.value})}
                  placeholder="dev007"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  value={newCard.description}
                  onChange={e => setNewCard({...newCard, description: e.target.value})}
                  placeholder="Enter description"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Source</FormLabel>
                <Input
                  value={newCard.source}
                  onChange={e => setNewCard({...newCard, source: e.target.value})}
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
                    {newCard.division?.length 
                      ? `${newCard.division.length} selected`
                      : 'Select divisions'}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup type="checkbox" value={newCard.division}>
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
                {newCard.division && newCard.division.length > 0 && (
                  <Box mt={2} p={2} borderWidth="1px" borderRadius="md">
                    <Text fontWeight="bold" mb={2}>Selected Divisions:</Text>
                    <Stack>
                      {newCard.division.map((div, index) => (
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

              <Button colorScheme="green" onClick={handleAddCard}>
                Add Card
              </Button>
            </Stack>
          </Box>

          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Current Cards</Heading>
            <Stack spacing={4}>
              {data.cardContent.profileTypes
                .find(type => type.type === selectedType)
                ?.cards.map((card, index) => (
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
                ))}
            </Stack>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CardContentEditor;
```
