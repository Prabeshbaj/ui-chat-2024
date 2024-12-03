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

// ... (previous interfaces remain same)

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
  const [activeTab, setActiveTab] = useState<SectionType>('profileTypes');
  const [selectedType, setSelectedType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const [newProfileCard, setNewProfileCard] = useState<ProfileCard>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default',
    division: []
  });

  const fetchCardContent = async () => {
    try {
      const response = await fetch('/api/cardContent');
      const jsonData: CardContent = await response.json();
      setOriginalData(JSON.parse(JSON.stringify(jsonData))); // Deep copy
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

  useEffect(() => {
    fetchCardContent();
  }, []);

  useEffect(() => {
    if (originalData && data) {
      setHasChanges(JSON.stringify(originalData) !== JSON.stringify(data));
    }
  }, [data, originalData]);

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

  const handleAddCard = () => {
    if (!data || !selectedType) return;

    let updatedData = { ...data };
    
    switch (activeTab) {
      case 'profileTypes':
        if (newProfileCard.id && newProfileCard.description && newProfileCard.source) {
          const typeIndex = updatedData.cardContent.profileTypes.findIndex(
            type => type.type === selectedType
          );
          if (typeIndex !== -1) {
            updatedData.cardContent.profileTypes[typeIndex].cards.push(newProfileCard);
            setData(updatedData);
            setNewProfileCard({
              id: '',
              description: '',
              source: '',
              role: 'DevAssist',
              style: 'default',
              division: []
            });
          }
        }
        break;

      // ... (similar for other sections)
    }
  };

  const handleDeleteCard = (card: ProfileCard | CardItem) => {
    if (!data || !selectedType) return;

    let updatedData = { ...data };
    
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
          setData(updatedData);
        }
        break;

      // ... (similar for other sections)
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
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('Failed to update content');
      
      setOriginalData(JSON.parse(JSON.stringify(data))); // Update original data
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

  // ... (renderCardForm and renderCards remain same)

  if (loading) return <Center h="200px"><Spinner size="xl" /></Center>;
  if (!data) return <Center h="200px"><Text>No data available</Text></Center>;

  return (
    <Card maxW="2xl" w="full">
      <CardHeader>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Card Content Editor</Heading>
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

        <Tabs onChange={(index) => {
          setActiveTab(['profileTypes', 'homeCards', 'guidelines'][index] as SectionType);
        }}>
          {/* ... (rest of the tabs section) */}
        </Tabs>
      </CardHeader>

      <CardBody>
        {/* ... (rest of the body section) */}
      </CardBody>
    </Card>
  );
};

export default CardContentEditor;
```
