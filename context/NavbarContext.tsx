// context/NavbarContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

type NavbarDimensions = {
  paddingClass: string;
  heightPx: number;
};

const NavbarContext = createContext({
  dimensions: { paddingClass: 'pt-16 md:pt-24', heightPx: 64 },
  setDimensions: (dimensions: NavbarDimensions) => {}
});

export const useNavbarContext = () => useContext(NavbarContext);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [dimensions, setDimensions] = useState<NavbarDimensions>({
    paddingClass: 'pt-16 md:pt-24', // Mobile first
    heightPx: 64
  });
  
  return (
    <NavbarContext.Provider value={{ dimensions, setDimensions }}>
      {children}
    </NavbarContext.Provider>
  );
}