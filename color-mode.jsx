// ./src/components/color-mode.jsx
import React, { createContext, useContext } from "react";
import {
  ChakraProvider,
  CSSReset,
  useColorMode as useChakraColorMode,
  IconButton,
} from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

// Context voor eigen color mode hook
const ColorModeContext = createContext();

export function ColorModeProvider({ children }) {
  return (
    <ChakraProvider>
      <CSSReset />
      <ColorModeContext.Provider value={useChakraColorMode()}>
        {children}
      </ColorModeContext.Provider>
    </ChakraProvider>
  );
}

// Hook om color mode te gebruiken
export function useColorMode() {
  const chakra = useContext(ColorModeContext);
  const toggleColorMode = () => {
    chakra.toggleColorMode();
  };
  return {
    colorMode: chakra.colorMode,
    setColorMode: chakra.setColorMode,
    toggleColorMode,
  };
}

// Hook voor value afhankelijk van mode
export function useColorModeValue(light, dark) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

// Icon die de huidige color mode toont
export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
}

// Button om color mode te toggelen
export const ColorModeButton = React.forwardRef((props, ref) => {
  const { toggleColorMode } = useColorMode();
  return (
    <IconButton
      onClick={toggleColorMode}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      icon={<ColorModeIcon />}
      {...props}
    />
  );
});

// Voeg displayName toe voor betere debugging
ColorModeButton.displayName = "ColorModeButton";