import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Heading,
  Image,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";
import { EditEventModal } from "../components/EditEventModal";

export const EventPage = () => {
  const { events, getCategoryNames, deleteEvent } = useContext(EventsContext);
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef();

  const event = events.find((e) => e.id.toString() === eventId?.toString());

  const handleDelete = async () => {
    try {
      await deleteEvent(parseInt(eventId));
      toast({
        title: "Event deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Failed to delete event",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <Heading>{event.title}</Heading>
        <Image
          src={event.image}
          alt={event.title}
          borderRadius="md"
          maxH="400px"
          objectFit="cover"
        />
        <Text fontSize="lg">{event.description}</Text>
        <Text>
          <strong>Start Time:</strong>{" "}
          {new Date(event.startTime).toLocaleString()}
        </Text>
        <Text>
          <strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}
        </Text>
        <Text>
          <strong>Categories:</strong>{" "}
          {getCategoryNames(event.categoryIds).join(", ")}
        </Text>
        <Box>
          <Button colorScheme="blue" mr={4} onClick={onEditOpen}>
            Edit Event
          </Button>
          <Button colorScheme="red" onClick={onDeleteOpen}>
            Delete Event
          </Button>
        </Box>
      </VStack>

      <EditEventModal isOpen={isEditOpen} onClose={onEditClose} event={event} />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete &ldquo;{event.title}&rdquo;? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
