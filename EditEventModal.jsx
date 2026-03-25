import {
  Button,
  Checkbox,
  CheckboxGroup,
  Field,
  FieldLabel,
  FieldErrorText,
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

export const EditEventModal = ({ isOpen, onClose, event }) => {
  const { categories, updateEvent } = useContext(EventsContext);
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
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        image: event.image,
        startTime: new Date(event.startTime).toISOString().slice(0, 16),
        endTime: new Date(event.endTime).toISOString().slice(0, 16),
        categoryIds: event.categoryIds.map((id) => id.toString()),
      });
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEvent(event.id, {
        ...formData,
        categoryIds: formData.categoryIds.map((id) => parseInt(id)),
      });

      toast({
        title: "Event updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Failed to update event",
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Field required>
                <FieldLabel>Title</FieldLabel>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Event title"
                />
              </Field>

              <Field required>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Event description"
                />
              </Field>

              <Field required>
                <FieldLabel>Image URL</FieldLabel>
                <Input
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                />
              </Field>

              <Field required>
                <FieldLabel>Start Time</FieldLabel>
                <Input
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </Field>

              <Field required>
                <FieldLabel>End Time</FieldLabel>
                <Input
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel>Categories</FieldLabel>
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
              </Field>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" type="submit">
              Update Event
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};