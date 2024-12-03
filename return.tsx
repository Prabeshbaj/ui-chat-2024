```typescript
return (
  <Grid templateColumns="1fr 300px" gap={4}>
    {/* Left Panel - Card Editor */}
    <GridItem>
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
            {/* Add New Card Form */}
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

            {/* Current Cards List */}
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
    </GridItem>

    {/* Right Panel - Changes Summary */}
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
```
