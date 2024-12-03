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
  Center
} from '@chakra-ui/react';

interface Card {
  id: string;
  description: string;
  source: string;
  role: string;
  style: string;
}

interface ProfileType {
  type: string;
  cards: Card[];
}

interface CardContent {
  cardContent: {
    profileTypes: ProfileType[];
  };
}

const DevAssistCardEditor: React.FC = () => {
  const [data, setData] = useState<CardContent | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const toast = useToast();

  const [newCard, setNewCard] = useState<Card>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/cards');
      if (!response.ok) throw new Error('Failed to fetch data');
      const jsonData = await response.json();
      setData(jsonData);
      setSelectedType(jsonData.cardContent.profileTypes[0].type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentProfileType = () => {
    return data?.cardContent.profileTypes.find(profile => profile.type === selectedType);
  };

  const addCard = async (): Promise<void> => {
    if (!data || !selectedType) return;

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCard, profileType: selectedType })
      });

      if (!response.ok) throw new Error('Failed to add card');

      const updatedProfileTypes = data.cardContent.profileTypes.map(profile =>
        profile.type === selectedType
          ? { ...profile, cards: [...profile.cards, newCard] }
          : profile
      );

      setData({
        cardContent: {
          profileTypes: updatedProfileTypes
        }
      });

      setNewCard({
        id: '',
        description: '',
        source: '',
        role: selectedType,
        style: 'default'
      });

      toast({ title: 'Success', description: 'Card added', status: 'success' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add card', status: 'error' });
    }
  };

  const deleteCard = async (id: string): Promise<void> => {
    if (!data || !selectedType) return;

    try {
      const response = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete card');

      const updatedProfileTypes = data.cardContent.profileTypes.map(profile =>
        profile.type === selectedType
          ? { ...profile, cards: profile.cards.filter(card => card.id !== id) }
          : profile
      );

      setData({
        cardContent: {
          profileTypes: updatedProfileTypes
        }
      });

      toast({ title: 'Success', description: 'Card deleted', status: 'success' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete card', status: 'error' });
    }
  };

  if (loading) return <Center h="200px"><Spinner size="xl" /></Center>;
  if (error || !data) return <Center h="200px"><Text color="red.500">Error loading data</Text></Center>;

  return (
    <Card maxW="2xl" w="full">
      <CardHeader>
        <Heading size="lg">Card Editor</Heading>
        <FormControl mt={4}>
          <FormLabel>Select Profile Type</FormLabel>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {data.cardContent.profileTypes.map(profile => (
              <option key={profile.type} value={profile.type}>
                {profile.type}
              </option>
            ))}
          </Select>
        </FormControl>
      </CardHeader>

      <CardBody>
        <Stack spacing={6}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Add New {selectedType} Card</Heading>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ID</FormLabel>
                <Input
                  value={newCard.id}
                  onChange={e => setNewCard({...newCard, id: e.target.value})}
                  placeholder={`${selectedType.toLowerCase()}001`}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  value={newCard.description}
                  onChange={e => setNewCard({...newCard, description: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Source</FormLabel>
                <Input
                  value={newCard.source}
                  onChange={e => setNewCard({...newCard, source: e.target.value})}
                />
              </FormControl>

              <Button colorScheme="green" onClick={addCard}>
                Add Card
              </Button>
            </Stack>
          </Box>

          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>{selectedType} Cards</Heading>
            <Stack spacing={4}>
              {getCurrentProfileType()?.cards.map(card => (
                <HStack key={card.id} p={2} borderWidth="1px" borderRadius="md">
                  <Box flex="1">
                    <Text fontWeight="bold">{card.id}</Text>
                    <Text>{card.description}</Text>
                    <Text fontSize="sm" color="gray.600">{card.source}</Text>
                  </Box>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => deleteCard(card.id)}
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

export default DevAssistCardEditor;
