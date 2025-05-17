"use client";

import { NavbarProvider, useNavbarContext } from "@/context/NavbarContext";
import { ReactNode } from "react";
import Navbar from "./navbar";
import { Toaster } from "sonner";
import Link from "next/link";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  return (
    <NavbarProvider>
      <Navbar />
      <main className={`${useNavbarContext().dimensions.paddingClass} md:4`}>
        {children}
        <Toaster />
      </main>
      <footer className="flex flex-col space-y-2.5 md:space-y-5 bg-silver text-black font-semibold md:text-lg p-2.5 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-5">
          <div className="flex flex-col">
            <span className="underline">Contact Us</span>
            <div className="flex space-x-2.5 md:space-x-5 text-sm">
              <span>Email:</span>
              <a
                href="mailto:ntulilindelani4@gmail.com"
                className="text-chest-nut underline"
              >
                ntulilindelani4@gmail.com
              </a>
            </div>
            <div className="flex space-x-2.5 md:space-x-5 text-sm">
              <span>Phone:</span>
              <a href="tel:0825455880" className="text-chest-nut underline">
                0825455880
              </a>
            </div>
          </div>
          <Link className="underline hover:text-chest-nut" href="about-us">
            About Us
          </Link>
          <Link className="underline hover:text-chest-nut" href="shipping-info">
            Shipping Info
          </Link>
          <Link
            className="underline hover:text-chest-nut"
            href="refund-returns"
          >
            Refund and Returns
          </Link>
        </div>
        <span className="text-gray-600 text-sm">
          © {new Date().getFullYear()} SDWADLO.CO. All rights reserved
        </span>
      </footer>
    </NavbarProvider>
  );
}
