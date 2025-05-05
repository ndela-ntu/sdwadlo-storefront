"use client";

import { NavbarProvider, useNavbarContext } from "@/context/NavbarContext";
import { ReactNode } from "react";
import Navbar from "./navbar";
import { Toaster } from "sonner";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <NavbarProvider>
      <Navbar />
      <main className={`${useNavbarContext().dimensions.paddingClass}`}>
        {children}
        <Toaster />
      </main>
    </NavbarProvider>
  );
}
