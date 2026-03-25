import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Box } from "@chakra-ui/react";
import { AddEventModal } from "./AddEventModal";

export const Root = () => {
  return (
    <Box>
      <Navigation />
      <AddEventModal />
      <Outlet />
    </Box>
  );
};
