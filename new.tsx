```typescript
// ... (previous imports remain the same)

interface ProfileCard {
  id: string;
  description: string;
  source: string;
  role: string;
  style: string;
  division?: string[]; // Optional division array
}

// ... (other interfaces remain the same)

const CardContentEditor: React.FC = () => {
  // ... (previous state declarations remain the same)
  
  const [newProfileCard, setNewProfileCard] = useState<ProfileCard>({
    id: '',
    description: '',
    source: '',
    role: 'DevAssist',
    style: 'default',
    division: [] // Initialize empty array
  });

  const [newDivision, setNewDivision] = useState<string>('');

  // ... (previous functions remain the same until renderCardForm)

  const handleAddDivision = () => {
    if (!newDivision.trim()) return;
    
    setNewProfileCard(prev => ({
      ...prev,
      division: [...(prev.division || []), newDivision.trim()]
    }));
    setNewDivision('');
  };

  const handleRemoveDivision = (indexToRemove: number) => {
    setNewProfileCard(prev => ({
      ...prev,
      division: prev.division?.filter((_, index) => index !== indexToRemove)
    }));
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
            <HStack>
              <Input
                value={newDivision}
                onChange={e => setNewDivision(e.target.value)}
                placeholder="Add division"
              />
              <Button onClick={handleAddDivision}>Add</Button>
            </HStack>
            {newProfileCard.division && newProfileCard.division.length > 0 && (
              <Stack mt={2} spacing={2}>
                {newProfileCard.division.map((div, index) => (
                  <HStack key={index}>
                    <Text flex="1">{div}</Text>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveDivision(index)}
                    >
                      Remove
                    </Button>
                  </HStack>
                ))}
              </Stack>
            )}
          </FormControl>
        </Stack>
      );
    }

    // ... (rest of the renderCardForm function remains the same)
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

      // ... (rest of the renderCards function remains the same)
    }
  };

  // ... (rest of the component remains the same)
};

export default CardContentEditor;
```
