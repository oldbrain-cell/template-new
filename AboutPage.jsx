import { Box, Heading, Text } from "@chakra-ui/react";

export const AboutPage = () => {
  return (
    <Box p={4}>
      <Heading>About Us</Heading>
      <Text mt={4}>
        This is an event management application built with React, ChakraUI, and
        React Router. It allows users to view, create, edit, and delete events.
        The app uses a JSON server for data persistence and includes features
        like search, filtering, and responsive design.
      </Text>
      <Text mt={4}>This page is now fully functional!</Text>
    </Box>
  );
};
