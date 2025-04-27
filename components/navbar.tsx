"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import IProduct from "@/models/product";
import { searchProducts } from "@/utils/search-products";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Brands", href: "/brands" },
  { name: "Apparel", href: "/apparel" },
  { name: "Accessories", href: "/accessories" },
  { name: "Collections", href: "/collections" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Handle search input changes with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
        setIsMenuOpen(false);
      }
      if (isSearchOpen && !(event.target as Element).closest(".search-panel")) {
        setIsSearchOpen(false);
      }
      if (isCartOpen && !(event.target as Element).closest(".cart-panel")) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, isSearchOpen, isCartOpen]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  return (
    <>
      {/* Search Panel - slides from top */}
      <div
        className={`search-panel fixed top-0 left-0 w-full bg-white z-[60] transition-all duration-300 ease-in-out ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 py-3 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-chest-nut"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button
              className="bg-chest-nut text-white py-3 px-6 rounded-r-lg hover:bg-chest-nut/90 transition"
              onClick={() => setIsSearchOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div className="mt-4 py-4 text-center text-gray-500">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <h4 className="font-medium">{product.name}</h4>
                    {/* Add more product details as needed */}
                  </Link>
                ))}
              </div>
            </div>
          ) : searchTerm ? (
            <div className="mt-4 py-4 text-center text-gray-500">
              No results found for "{searchTerm}"
            </div>
          ) : null}
        </div>
      </div>

      {/* Cart Panel - slides from right */}
      <div
        className={`cart-panel fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-[60] transition-all duration-300 ease-in-out shadow-xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href="/products"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-chest-nut text-white rounded-md hover:bg-chest-nut/90 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Footer (will be useful when cart has items) */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">R0.00</span>
            </div>
            <button
              disabled
              className="w-full py-3 bg-gray-300 text-white rounded-md cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 py-4"
        }`}
      >
         <div className="px-4 md:px-8 lg:px-16 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-eerieBlack text-2xl md:text-3xl lg:text-4xl pb-1 font-black italic">
                SDWADLO.CO
              </h1>
            </Link>
            <div className="hidden md:flex space-x-8 md:ml-8 md:text-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  className={`transition hover:text-chest-nut ${
                    isActive(item.href) &&
                    "border-b-4 border-chest-nut text-chest-nut font-bold"
                  }`}
                  href={item.href}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search />
            </button>
            <button onClick={() => setIsCartOpen(!isCartOpen)}>
              <ShoppingCart />
            </button>
            <button
              className="md:hidden text-eerie-black focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu (unchanged) */}
          <div
            className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden transition-transform duration-300 ease-in-out z-50`}
          >
            <div className="flex flex-col p-4 space-y-4 mt-8">
              <h1 className="text-eerieBlack text-2xl md:text-3xl lg:text-4xl pb-1 font-black italic">
                SDWADLO.CO
              </h1>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  className={`transition hover:text-chest-nut max-w-fit ${
                    isActive(item.href) &&
                    "border-b-4 border-chest-nut text-chest-nut font-bold"
                  }`}
                  href={item.href}
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Overlay */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;