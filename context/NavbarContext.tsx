// context/NavbarContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type NavbarDimensions = {
  paddingClass: string;
  heightPx: number;
};

const NavbarContext = createContext({
  dimensions: { paddingClass: "pt-[84px]", heightPx: 84 },
  setDimensions: (dimensions: NavbarDimensions) => {},
});

export const useNavbarContext = () => useContext(NavbarContext);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [dimensions, setDimensions] = useState<NavbarDimensions>({
    paddingClass: "pt-[84px]",
    heightPx: 68,
  });

  return (
    <NavbarContext.Provider value={{ dimensions, setDimensions }}>
      {children}
    </NavbarContext.Provider>
  );
}
