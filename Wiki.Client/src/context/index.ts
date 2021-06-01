import React from 'react';

interface ThemeContextProps {
  isDarkTheme: boolean;
  onThemeToggle: (checked: boolean) => void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  isDarkTheme: false,
  onThemeToggle: (_: boolean) => null
});
