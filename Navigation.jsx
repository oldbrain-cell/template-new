import { Flex, Link } from "@chakra-ui/react";
import { useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { EventsContext } from "../context/EventsContext";

export const Navigation = () => {
  const { setIsAddModalOpen } = useContext(EventsContext);

  return (
    <nav>
      <Flex gap={2} p={4} bg="gray.100">
        <Link as={RouterLink} to="/">
          Events
        </Link>
        <Link onClick={() => setIsAddModalOpen(true)} cursor="pointer">
          Add Event
        </Link>
        <Link as={RouterLink} to="/about">
          About
        </Link>
      </Flex>
    </nav>
  );
};
