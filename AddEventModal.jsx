import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { EventsContext } from "../context/EventsContext";

export const AddEventModal = () => {
  const { categories, createEvent, isAddModalOpen, setIsAddModalOpen } =
    useContext(EventsContext);
  const toast = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categoryIds: [],
  });

  useEffect(() => {
    if (!isAddModalOpen) {
      setFormData({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categoryIds: [],
      });
    }
  }, [isAddModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        categoryIds: formData.categoryIds.map((id) => parseInt(id)),
      });
      toast({
        title: "Event created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (values) => {
    setFormData((prev) => ({ ...prev, categoryIds: values }));
  };

  return (
    <Modal
      isOpen={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event title"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event description"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Start Time</FormLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>End Time</FormLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Categories</FormLabel>
                <CheckboxGroup
                  value={formData.categoryIds}
                  onChange={handleCategoriesChange}
                >
                  <VStack align="start">
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </Checkbox>
                    ))}
                  </VStack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Create Event
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
