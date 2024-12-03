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

// Define types based on the JSON structure
interface CardItem {
  header: string;
  description: string;
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
    profileTypes: any[]; // Keeping this as shown in the JSON
    homeCards: HomeCardSection[];
    guidelines: GuidelineSection[];
  };
}

interface SectionType {
  type: 'homeCards' | 'guidelines';
  name: string;
}

const CardContentEditor: React.FC = () => {
  const [data, setData] = useState<CardContent | null>(null);
  const [activeSection, setActiveSection] = useState<SectionType>({
    type: 'homeCards',
    name: 'DevAssist'
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const [newCard, setNewCard] = useState<CardItem>({
    header: '',
    description: ''
  });

  useEffect(() => {
    fetchCardContent();
  }, []);

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

  const getCurrentCards = () => {
    if (!data) return [];
    
    if (activeSection.type === 'homeCards') {
      return data.cardContent.homeCards.find(
        section => section.type === activeSection.name
      )?.cards || [];
    } else {
      return data.cardContent.guidelines.find(
        section => section.type === activeSection.name
      )?.cards || [];
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
    if (!data || !newCard.description) {
      toast({
        title: 'Please fill in the description',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const updatedData = { ...data };
    
    if (activeSection.type === 'homeCards') {
      const sectionIndex = updatedData.cardContent.homeCards.findIndex(
        section => section.type === activeSection.name
      );
      
      if (sectionIndex !== -1) {
        updatedData.cardContent.homeCards[sectionIndex].cards.push(newCard);
      }
    } else {
      const sectionIndex = updatedData.cardContent.guidelines.findIndex(
        section => section.type === activeSection.name
      );
      
      if (sectionIndex !== -1) {
        updatedData.cardContent.guidelines[sectionIndex].cards.push(newCard);
      }
    }

    await updateCardContent(updatedData);
    setNewCard({ header: '', description: '' });
  };

  const handleDeleteCard = async (cardToDelete: CardItem) => {
    if (!data) return;

    const updatedData = { ...data };
    
    if (activeSection.type === 'homeCards') {
      const sectionIndex = updatedData.cardContent.homeCards.findIndex(
        section => section.type === activeSection.name
      );
      
      if (sectionIndex !== -1) {
        updatedData.cardContent.homeCards[sectionIndex].cards = 
          updatedData.cardContent.homeCards[sectionIndex].cards.filter(
            card => card.description !== cardToDelete.description
          );
      }
    } else {
      const sectionIndex = updatedData.cardContent.guidelines.findIndex(
        section => section.type === activeSection.name
      );
      
      if (sectionIndex !== -1) {
        updatedData.cardContent.guidelines[sectionIndex].cards = 
          updatedData.cardContent.guidelines[sectionIndex].cards.filter(
            card => card.description !== cardToDelete.description
          );
      }
    }

    await updateCardContent(updatedData);
  };

  if (loading) return <Center h="200px"><Spinner size="xl" /></Center>;
  if (!data) return <Center h="200px"><Text>No data available</Text></Center>;

  return (
    <Card maxW="2xl" w="full">
      <CardHeader>
        <Heading size="lg" mb={4}>Card Content Editor</Heading>
        <Tabs onChange={(index) => {
          setActiveSection({
            type: index === 0 ? 'homeCards' : 'guidelines',
            name: index === 0 ? 'DevAssist' : 'DevAssist'
          });
        }}>
          <TabList>
            <Tab>Home Cards</Tab>
            <Tab>Guidelines</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Select
                value={activeSection.name}
                onChange={(e) => setActiveSection({
                  type: 'homeCards',
                  name: e.target.value
                })}
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
                value={activeSection.name}
                onChange={(e) => setActiveSection({
                  type: 'guidelines',
                  name: e.target.value
                })}
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

              <Button colorScheme="green" onClick={handleAddCard}>
                Add Card
              </Button>
            </Stack>
          </Box>

          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Heading size="md" mb={4}>Current Cards</Heading>
            <Stack spacing={4}>
              {getCurrentCards().map((card, index) => (
                <HStack key={index} p={4} borderWidth="1px" borderRadius="md">
                  <Box flex="1">
                    {card.header && (
                      <Text fontWeight="bold" mb={2}>{card.header}</Text>
                    )}
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
