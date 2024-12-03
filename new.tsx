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
  TabPanel
} from '@chakra-ui/react';

interface ProfileCard {
  id: string;
  description: string;
  source: string;
  role: string;
  style: string;
}

interface CardItem {
  header: string;
  description: string;
}

interface ProfileType {
  type: string;
  cards: ProfileCard[];
}

interface HomeCardSection {
  type: string;
  cards: CardItem[];
}

interface GuidelineSection {
  type: string;
  supportEmail: string;
  header: string;
  learn: string;
  cards: CardItem[];
}

interface CardContent {
  cardContent: {
    profileTypes: ProfileType[];
    homeCards: HomeCardSection[];
    guidelines: GuidelineSection[];
  };
}

type SectionType = 'profileTypes' | 'homeCards' | 'guidelines';

const CardContentEditor: React.FC = () => {
  const [data, setData] = useState<CardContent | null>(null);
  const [activeTab, setActiveTab] = useState<SectionType>('profileTypes');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [newProfileCard, setNewProfileCard] = useState<ProfileCard>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default'
  });

  const [newCard, setNewCard] = useState<CardItem>({
    header: '',
    description: ''
  });

  useEffect(() => {
    fetchCardContent();
  }, []);

  useEffect(() => {
    if (data) {
      switch (activeTab) {
        case 'profileTypes':
          setSelectedType(data.cardContent.profileTypes[0]?.type || '');
          break;
        case 'homeCards':
          setSelectedType(data.cardContent.homeCards[0]?.type || '');
          break;
        case 'guidelines':
          setSelectedType(data.cardContent.guidelines[0]?.type || '');
          break;
      }
    }
  }, [activeTab, data]);

  const fetchCardContent = async () => {
    try {
      const response = await fetch('/api/cardContent');
      const jsonData: CardContent = await response.json();
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

  const updateCardContent = async (updatedData: CardContent) => {
    try {
      const response = await fetch('/api/cardContent', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) throw new Error('Failed to update content');
      
      setData(updatedData);
      toast({
        title: 'Content updated successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to update content',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleAddCard = async () => {
    if (!data || !selectedType) return;

    const updatedData = { ...data };
    
    switch (activeTab) {
      case 'profileTypes':
        if (newProfileCard.id && newProfileCard.description && newProfileCard.source) {
          const typeIndex = updatedData.cardContent.profileTypes.findIndex(
            type => type.type === selectedType
          );
          if (typeIndex !== -1) {
            updatedData.cardContent.profileTypes[typeIndex].cards.push(newProfileCard);
            await updateCardContent(updatedData);
            setNewProfileCard({
              id: '',
              description: '',
              source: '',
              role: 'DevAssist',
              style: 'default'
            });
          }
        }
        break;

      case 'homeCards':
      case 'guidelines':
        if (newCard.description) {
          const section = activeTab === 'homeCards' ? 'homeCards' : 'guidelines';
          const sectionIndex = updatedData.cardContent[section].findIndex(
            s => s.type === selectedType
          );
          if (sectionIndex !== -1) {
            updatedData.cardContent[section][sectionIndex].cards.push(newCard);
            await updateCardContent(updatedData);
            setNewCard({ header: '', description: '' });
          }
        }
        break;
    }
  };

  const handleDeleteCard = async (card: ProfileCard | CardItem) => {
    if (!data || !selectedType) return;

    const updatedData = { ...data };
    
    switch (activeTab) {
      case 'profileTypes':
        const profileCard = card as ProfileCard;
        const typeIndex = updatedData.cardContent.profileTypes.findIndex(
          type => type.type === selectedType
        );
        if (typeIndex !== -1) {
          updatedData.cardContent.profileTypes[typeIndex].cards = 
            updatedData.cardContent.profileTypes[typeIndex].cards.filter(
              c => c.id !== profileCard.id
            );
        }
        break;

      case 'homeCards':
      case 'guidelines':
        const basicCard = card as CardItem;
        const section = activeTab === 'homeCards' ? 'homeCards' : 'guidelines';
        const sectionIndex = updatedData.cardContent[section].findIndex(
          s => s.type === selectedType
        );
        if (sectionIndex !== -1) {
          updatedData.cardContent[section][sectionIndex].cards = 
            updatedData.cardContent[section][sectionIndex].cards.filter(
              c => c.description !== basicCard.description
            );
        }
        break;
    }

    await updateCardContent(updatedData);
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
        </Stack>
      );
    }

    return (
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Header</FormLabel>
          <Input
            value={newCard.header}
            onChange={e => setNewCard({...newCard, header: e.target.value})}
            placeholder="Enter header (optional)"
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
      </Stack>
    );
  };

  const renderCards = () => {
    if (!data || !selectedType) return null;

    switch (activeTab) {
      case 'profileTypes':
        const profileType = data.cardContent.profileTypes.find(
          type => type.type === selectedType
        );
        return profileType?.cards.map((card, index) => (
          <HStack key={index} p={4} borderWidth="1px" borderRadius="md">
            <Box flex="1">
              <Text fontWeight="bold">ID: {card.id}</Text>
              <Text>Description: {card.description}</Text>
              <Text>Source: {card.source}</Text>
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

      case 'homeCards':
      case 'guidelines':
        const section = activeTab === 'homeCards' ? 'homeCards' : 'guidelines';
        const currentSection = data.cardContent[section].find(
          s => s.type === selectedType
        );
        return currentSection?.cards.map((card, index) => (
          <HStack key={index} p={4} borderWidth="1px" borderRadius="md">
            <Box flex="1">
              {card.header && <Text fontWeight="bold">{card.header}</Text>}
              <Text>{card.description}</Text>
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
    }
  };

  if (loading) return <Center h="200px"><Spinner size="xl" /></Center>;
  if (!data) return <Center h="200px"><Text>No data available</Text></Center>;

  return (
    <Card maxW="2xl" w="full">
      <CardHeader>
        <Heading size="lg" mb={4}>Card Content Editor</Heading>
        <Tabs onChange={(index) => {
          setActiveTab(['profileTypes', 'homeCards', 'guidelines'][index] as SectionType);
        }}>
          <TabList>
            <Tab>Cards</Tab>
            <Tab>Home Cards</Tab>
            <Tab>Guidelines</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {data.cardContent.homeCards.map(section => (
                  <option key={section.type} value={section.type}>
                    {section.type}
                  </option>
                ))}
              </Select>
            </TabPanel>
            <TabPanel>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {data.cardContent.guidelines.map(section => (
                  <option key={section.type} value={section.type}>
                    {section.type}
                  </option>
                ))}
              </Select>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardHeader>

      <CardBody>
        <Stack spacing={6}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Add New Card</Heading>
            {renderCardForm()}
            <Button colorScheme="green" mt={4} onClick={handleAddCard}>
              Add Card
            </Button>
          </Box>

          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Current Cards</Heading>
            <Stack spacing={4}>
              {renderCards()}
            </Stack>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default CardContentEditor;
```
