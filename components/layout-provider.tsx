"use client";

import { NavbarProvider, useNavbarContext } from "@/context/NavbarContext";
import { ReactNode, useEffect, useState } from "react";
import Navbar from "./navbar";
import { Toaster } from "sonner";
import Link from "next/link";
import { CartProvider } from "@/context/CartContext";
import { ItemTotalsProvider } from "@/context/ItemTotalsContext";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CartProvider>
      <ItemTotalsProvider>
        <NavbarProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className={`pt-20 ${isScrolled ? "pt-16" : "pt-20"}`}>
              {children}
              <Toaster richColors />
            </main>
            <div className="border-b border-gray-500" />
            <footer className="text-black">
              <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold underline decoration-chest-nut decoration-2 underline-offset-4">
                      Contact Us
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="mt-0.5">✉️</span>
                        <div>
                          <p className="text-sm font-medium">Email:</p>
                          <a
                            href="mailto:ntulilindelani4@gmail.com"
                            className="text-chest-nut hover:text-chest-nut-dark underline underline-offset-2 text-sm"
                          >
                            ntulilindelani4@gmail.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="mt-0.5">📞</span>
                        <div>
                          <p className="text-sm font-medium">Phone:</p>
                          <a
                            href="tel:0825455880"
                            className="text-chest-nut hover:text-chest-nut-dark underline underline-offset-2 text-sm"
                          >
                            082 545 5880
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold underline decoration-chest-nut decoration-2 underline-offset-4">
                      Information
                    </h3>
                    <nav className="space-y-3">
                      <Link
                        className="block text-sm hover:text-chest-nut transition-colors duration-200"
                        href="about-us"
                      >
                        About Us
                      </Link>
                      <Link
                        className="block text-sm hover:text-chest-nut transition-colors duration-200"
                        href="shipping-info"
                      >
                        Shipping Info
                      </Link>
                      <Link
                        className="block text-sm hover:text-chest-nut transition-colors duration-200"
                        href="refund-returns"
                      >
                        Refund & Returns
                      </Link>
                    </nav>
                  </div>

                  {/* <div className="md:col-span-2">
                    <h3 className="text-lg font-bold underline decoration-chest-nut decoration-2 underline-offset-4 mb-4">
                      Stay Connected
                    </h3>
                    <p className="text-sm text-gray-700">
                      Follow us on social media for updates and promotions.
                    </p>
                  </div> */}
                </div>

                <div className="border-t border-gray-300 pt-6">
                  <p className="text-gray-600 text-xs md:text-sm text-center">
                    © {new Date().getFullYear()} SDWADLO. All rights reserved
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </NavbarProvider>
      </ItemTotalsProvider>
    </CartProvider>
  );
}
