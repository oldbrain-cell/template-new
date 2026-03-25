import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Flex,
  Grid,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";
import { AiOutlineSearch } from "react-icons/ai";

export const EventsPage = () => {
  const {
    events,
    categories,
    isLoading,
    error,
    getCategoryNames,
    setIsAddModalOpen,
  } = useContext(EventsContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((catId) =>
          event.categoryIds.some(
            (eventCatId) => eventCatId.toString() === catId.toString(),
          ),
        );
      return matchesSearch && matchesCategories;
    });
  }, [events, searchTerm, selectedCategories]);

  if (isLoading) {
    return (
      <Box p={4}>
        <VStack spacing={4} align="stretch">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton height="20px" />
              </CardHeader>
              <CardBody>
                <Skeleton height="100px" />
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Failed to load events: {error}</Text>
      </Box>
    );
  }

  if (!filteredEvents.length) {
    return (
      <Box p={4}>
        <Text>
          No events found. Controleer of JSON-server draait op
          http://localhost:3000.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Heading>Events</Heading>
        <Button colorScheme="blue" onClick={() => setIsAddModalOpen(true)}>
          Add Event
        </Button>
      </Flex>

      <Flex gap={6} mb={6} direction={{ base: "column", md: "row" }}>
        <Box flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <AiOutlineSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
        <Box>
          <Text mb={2} fontWeight="bold">
            Filter by categories:
          </Text>
          <CheckboxGroup
            value={selectedCategories}
            onChange={setSelectedCategories}
          >
            <Stack spacing={2} direction={{ base: "column", md: "row" }}>
              {categories.map((category) => (
                <Checkbox key={category.id} value={category.id.toString()}>
                  {category.name}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </Box>
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            as={Link}
            to={`/event/${event.id}`}
            _hover={{ shadow: "lg" }}
          >
            <CardHeader>
              <Heading size="md">{event.title}</Heading>
            </CardHeader>
            <CardBody>
              <Image
                src={event.image}
                alt={event.title}
                borderRadius="md"
                mb={3}
                objectFit="cover"
                height="200px"
                width="100%"
              />
              <Text mb={2}>{event.description}</Text>
              <Text fontSize="sm" color="gray.600">
                Start: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text fontSize="sm" color="gray.600" mb={2}>
                End: {new Date(event.endTime).toLocaleString()}
              </Text>
              <Text fontSize="sm">
                Categories: {getCategoryNames(event.categoryIds).join(", ")}
              </Text>
            </CardBody>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};
