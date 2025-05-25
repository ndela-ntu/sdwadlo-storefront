"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  Search,
  ShoppingCart,
  Trash,
  User,
  X,
} from "lucide-react";
import IProduct from "@/models/product";
import { searchProducts } from "@/utils/search-products";
import IBrand from "@/models/brand";
import ICategory from "@/models/category";
import ITag from "@/models/tag";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavbarContext } from "@/context/NavbarContext";
import { useCart } from "@/context/CartContext";
import { useItemTotals } from "@/context/ItemTotalsContext";
import Image from "next/image";
import QuantitySelector from "./quantity-selector";

interface NavItem {
  name: string;
  href?: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Brands" },
  { name: "Categories" },
  { name: "Collections" },
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
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { dimensions, setDimensions } = useNavbarContext();
  const [isMobile, setIsMobile] = useState(false);
  const { cart, removeProduct } = useCart();
  const { itemTotals, addItemTotal, removeItemTotal, clearItemTotals } =
    useItemTotals();
  const [total, setTotal] = useState<number>(0);
  const [freeShipmentAmount, setFreeShipmentAmount] = useState<number>(0);

  const router = useRouter();

  const isFirstRender = useRef(true);
  const prevCartLength = useRef(cart.length);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevCartLength.current = cart.length;
      return;
    }

    const wasProductAdded = cart.length > prevCartLength.current;
    prevCartLength.current = cart.length;

    if (wasProductAdded) {
      setIsCartOpen(true);
    }
  }, [cart]);

  useEffect(() => {
    clearItemTotals();
    cart.forEach((entry) => {
      addItemTotal({ id: entry.variant.id, total: entry.product.price });
    });

    const fetchFreeShipmentAmount = async () => {
      try {
        const { data, error } = await supabase
          .from("shipping_setting")
          .select("*")
          .eq("id", 1)
          .single();

        if (error) throw error;

        setFreeShipmentAmount(data.free_shipment_amount);
      } catch (error: any) {
        toast("Error", { description: `An error occurred: ${error.message}` });
      }
    };

    fetchFreeShipmentAmount();
  }, []);

  useEffect(() => {
    setTotal(itemTotals.reduce((a, v) => a + v.total, 0));
  }, [itemTotals]);

  const updateTotal = (variantId: number, quantity: number) => {
    const cartProduct = cart.find((entry) => entry.variant.id === variantId);

    removeItemTotal(variantId);
    addItemTotal({
      id: variantId,
      total: (cartProduct?.product.price || 0) * quantity,
    });
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setDimensions(
        isScrolled
          ? { paddingClass: "pt-14", heightPx: 56 } // Slim mobile scrolled
          : { paddingClass: "pt-16", heightPx: 64 } // Regular mobile
      );
    } else {
      setDimensions(
        isScrolled
          ? { paddingClass: "pt-16", heightPx: 64 } // Slim desktop scrolled
          : { paddingClass: "pt-16", heightPx: 64 } // Regular desktop
      );
    }
  }, [isScrolled, isMobile]);

  const handleLinkClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleSection = (sectionName: string) => {
    if (expandedSection === sectionName) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionName);
    }
  };

  const handleDropdownOpenChange = (name: string, isOpen: boolean) => {
    setOpenDropdown(isOpen ? name : null);
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

  useEffect(() => {
    const fetchData = async () => {
      const { data: brands, error: brandsError } = await supabase
        .from("brand")
        .select("*")
        .eq("status", "Active");

      const { data: categories, error: categoriesError } = await supabase
        .from("category")
        .select("*")
        .eq("status", "Active");

      const { data: tags, error: tagsError } = await supabase
        .from("tag")
        .select("*")
        .eq("status", "Active");

      if (brandsError || categoriesError || tagsError) {
        toast("Error occurred", {
          description: `Error message: ${
            brandsError?.message ||
            categoriesError?.message ||
            tagsError?.message
          }`,
        });
      } else {
        setBrands(brands);
        setCategories(categories);
        setTags(tags);
      }
    };

    fetchData();
  }, []);

  const isActive = (href: string): boolean => {
    return pathname === href;
  };

  const renderMobileSection = (itemName: string) => {
    switch (itemName) {
      case "Brands":
        return (
          <div className="w-full">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("brands")}
            >
              <span>{itemName}</span>
              {expandedSection === "brands" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSection === "brands" ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="pl-2 py-2 space-y-2 text-base">
                {brands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brand/${brand.id}`}
                    className="block py-1 hover:text-chest-nut transition"
                    onClick={handleLinkClick}
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      case "Categories":
        return (
          <div className="w-full">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("categories")}
            >
              <span>{itemName}</span>
              {expandedSection === "categories" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSection === "categories" ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="pl-2 py-2 space-y-2 text-base">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block py-1 hover:text-chest-nut transition"
                    onClick={handleLinkClick}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      case "Collections":
        return (
          <div className="w-full">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleSection("collections")}
            >
              <span>{itemName}</span>
              {expandedSection === "collections" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSection === "collections" ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="pl-2 py-2 space-y-2 text-base">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/collection/${tag.id}`}
                    className="block py-1 hover:text-chest-nut transition"
                    onClick={handleLinkClick}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
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
              className="flex-1 py-2 px-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-chest-nut"
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
                    className="flex items-center space-x-1 md:space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <div className="relative aspect-square w-1/3 md:w-1/4">
                      <Image
                        src={product.product_variant[0].image_urls[0]}
                        alt="Image of item"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-medium">{product.name}</h4>
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
        className={`px-2.5 md:p-5 cart-panel fixed top-0 right-0 h-full w-full sm:w-96 lg:w-[35%] bg-white z-[60] transition-all duration-300 ease-in-out shadow-xl ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
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
          ) : (
            <div className="flex flex-col space-y-2.5">
              {cart.map((entry, i) => (
                <div key={i} className="flex space-x-2.5">
                  <div className="relative aspect-square border w-1/2">
                    <Image
                      src={entry.variant.image_urls[0]}
                      alt="Image of item"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col space-y-2.5 w-1/2 py-2.5 px-1 md:py-5 md:px-2.5">
                    <div className="flex flex-col">
                      <span className="text-xs md:text-base text-gray-600">
                        {entry.product.brand.name}
                      </span>
                      <span className="text-base md:text-lg font-bold">
                        {entry.product.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-base font-semibold">
                        R{entry.product.price}
                      </span>
                      {entry.variant.size && (
                        <span className="text-xs md:text-base text-gray-600">
                          Size: {entry.variant.size.name}
                        </span>
                      )}
                      {entry.variant.color && (
                        <span className="text-xs md:text-base text-gray-600">
                          Color: {entry.variant.color.name}
                        </span>
                      )}
                    </div>
                    <QuantitySelector
                      maxQuantity={entry.variant.quantity}
                      onChangeCB={(value) => {
                        updateTotal(entry.variant.id, value);
                      }}
                    />
                    <button
                      onClick={() => {
                        removeProduct(entry.product.id, entry.variant.id);
                        removeItemTotal(entry.variant.id);
                      }}
                      className="flex items-center justify-center space-x-2.5 text-sm md:text-base max-w-fit bg-silver text-white p-1 md:p-2.5 rounded-lg"
                    >
                      <Trash className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-bold">R{total}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={() => {
                setIsCartOpen(false);
                router.push("/checkout");
              }}
              className="w-full py-3 disabled:bg-gray-300 bg-chest-nut text-white rounded-md disabled:cursor-not-allowed hover:bg-silver hover:text-white"
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
        style={{ height: `${dimensions.heightPx}px` }}
      >
        <div className="flex flex-col w-full">
          <div className="px-4 md:px-8 lg:px-16 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-eerieBlack text-2xl md:text-3xl lg:text-4xl pb-1 font-black italic">
                  SDWADLO.CO
                </h1>
              </Link>
              <div className="hidden md:flex md:items-center space-x-8 md:ml-8 md:text-xl">
                {navItems.map((item) => {
                  if (item.href) {
                    return (
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
                    );
                  } else {
                    return (
                      <DropdownMenu
                        key={item.name}
                        onOpenChange={(isOpen) =>
                          handleDropdownOpenChange(item.name, isOpen)
                        }
                      >
                        <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                          <span className="transition hover:text-chest-nut">
                            {item.name}
                          </span>
                          {openDropdown === item.name ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 max-h-[60vh] overflow-y-auto">
                          {item.name === "Brands" && (
                            <>
                              <DropdownMenuLabel>
                                Shop by Brand
                              </DropdownMenuLabel>
                              {brands.map((brand) => (
                                <DropdownMenuItem key={brand.id} asChild>
                                  <Link href={`/brand/${brand.id}`}>
                                    {brand.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                          {item.name === "Categories" && (
                            <>
                              <DropdownMenuLabel>
                                Shop by Category
                              </DropdownMenuLabel>
                              {categories.map((category) => (
                                <DropdownMenuItem key={category.id} asChild>
                                  <Link href={`/category/${category.id}`}>
                                    {category.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                          {item.name === "Collections" && (
                            <>
                              <DropdownMenuLabel>
                                Shop Collections
                              </DropdownMenuLabel>
                              {tags.map((tag) => (
                                <DropdownMenuItem key={tag.id} asChild>
                                  <Link href={`/collection/${tag.id}`}>
                                    {tag.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="cursor-pointer"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  className="relative cursor-pointer"
                >
                  <ShoppingCart />
                </button>

                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-chest-nut rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
              <button
                className="md:hidden text-eerie-black focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

            {/* Mobile Menu */}
            <div
              className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white transform ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              } md:hidden transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
            >
              <div className="flex flex-col p-2 space-y-4">
                <h1 className="text-eerieBlack text-2xl md:text-3xl lg:text-4xl pb-1 font-black italic">
                  SDWADLO.CO
                </h1>
                {navItems.map((item) => {
                  if (item.href) {
                    return (
                      <Link
                        key={item.name}
                        className={`transition hover:text-chest-nut text-lg max-w-fit ${
                          isActive(item.href) &&
                          "border-b-2 border-chest-nut text-chest-nut font-bold"
                        }`}
                        href={item.href}
                        onClick={handleLinkClick}
                      >
                        {item.name}
                      </Link>
                    );
                  } else {
                    return (
                      <div key={item.name} className="w-full text-lg">
                        {renderMobileSection(item.name)}
                      </div>
                    );
                  }
                })}
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
          <div className="flex items-center justify-center bg-chest-nut text-white text-sm">
            Free delivery on orders over: R{freeShipmentAmount}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
