```typescript
// ... (previous imports)
import { Box, Grid, GridItem, Divider } from '@chakra-ui/react';

// Add new interface for tracking changes
interface Change {
  id: string;
  timestamp: number;
  type: 'add' | 'delete';
  details: {
    profileType: string;
    cardId: string;
    description: string;
  };
}

const CardContentEditor: React.FC = () => {
  // ... (previous state declarations)
  const [changes, setChanges] = useState<Change[]>([]);

  // Modify handleAddCard to track changes
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
      
      // Track the change
      setChanges(prev => [...prev, {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        type: 'add',
        details: {
          profileType: selectedType,
          cardId: newCard.id,
          description: newCard.description
        }
      }]);

      setNewCard({
        id: '',
        description: '',
        source: '',
        role: 'DevAssist',
        style: 'default',
        division: []
      });
    }
  };

  // Modify handleDeleteCard to track changes
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

      // Track the change
      setChanges(prev => [...prev, {
        id: `${Date.now()}`,
        timestamp: Date.now(),
        type: 'delete',
        details: {
          profileType: selectedType,
          cardId: cardToDelete.id,
          description: cardToDelete.description
        }
      }]);
    }
  };

  // Modify handleApplyChanges to clear changes
  const handleApplyChanges = async () => {
    // ... (previous implementation)
    try {
      // ... (API call)
      setChanges([]); // Clear changes after successful update
    } catch (error) {
      // ... (error handling)
    }
  };

  // Modify handleDiscardChanges to clear changes
  const handleDiscardChanges = () => {
    if (originalData) {
      setData(JSON.parse(JSON.stringify(originalData)));
      setChanges([]); // Clear changes when discarding
      setHasChanges(false);
      toast({
        title: 'Changes discarded',
        status: 'info',
        duration: 2000,
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Grid templateColumns="1fr 300px" gap={4}>
      <GridItem>
        {/* Existing Card component */}
        <Card maxW="2xl" w="full">
          {/* ... (existing card content) */}
        </Card>
      </GridItem>

      <GridItem>
        <Card position="sticky" top={4}>
          <CardHeader>
            <Heading size="md">Pending Changes</Heading>
          </CardHeader>
          <CardBody>
            {changes.length === 0 ? (
              <Text color="gray.500">No changes made yet</Text>
            ) : (
              <Stack spacing={4}>
                {changes.map((change) => (
                  <Box
                    key={change.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={change.type === 'add' ? 'green.200' : 'red.200'}
                    bg={change.type === 'add' ? 'green.50' : 'red.50'}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text
                        fontWeight="bold"
                        color={change.type === 'add' ? 'green.600' : 'red.600'}
                      >
                        {change.type === 'add' ? 'Added Card' : 'Deleted Card'}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {formatTimestamp(change.timestamp)}
                      </Text>
                    </HStack>
                    <Text fontSize="sm">Profile: {change.details.profileType}</Text>
                    <Text fontSize="sm">ID: {change.details.cardId}</Text>
                    <Text fontSize="sm" noOfLines={2}>
                      Description: {change.details.description}
                    </Text>
                  </Box>
                ))}
              </Stack>
            )}
          </CardBody>
          {changes.length > 0 && (
            <CardFooter>
              <ButtonGroup width="full">
                <Button
                  width="full"
                  colorScheme="red"
                  variant="ghost"
                  onClick={handleDiscardChanges}
                >
                  Discard All
                </Button>
                <Button
                  width="full"
                  colorScheme="green"
                  onClick={handleApplyChanges}
                  isLoading={isSaving}
                >
                  Apply All
                </Button>
              </ButtonGroup>
            </CardFooter>
          )}
        </Card>
      </GridItem>
    </Grid>
  );
};

export default CardContentEditor;
```
