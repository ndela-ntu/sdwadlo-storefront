'use client';

import IProduct from "@/models/product";
import IProductVariant from "@/models/product-variant";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

const STORAGE_KEY = "sdwadlo:cart";

interface CartEntry {
  product: IProduct;
  variant: IProductVariant;
}

interface CartState {
  cart: CartEntry[];
  addProduct: (product: IProduct, variant: IProductVariant) => void;
  removeProduct: (productId: number, variantId: number) => void;
  clearCart: () => void;
}

type Action =
  | { type: "ADD_PRODUCT"; payload: CartEntry }
  | {
      type: "REMOVE_PRODUCT";
      payload: { productId: number; variantId: number };
    }
  | { type: "CLEAR_CART" };

const CartContext = createContext<CartState | undefined>(undefined);

const cartReducer = (state: CartEntry[], action: Action): CartEntry[] => {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const existingEntryIndex = state.findIndex(
        (entry) =>
          entry.product.id === action.payload.product.id &&
          entry.variant.id === action.payload.variant.id
      );

      if (existingEntryIndex >= 0) {
        const updatedCart = [...state];
        updatedCart[existingEntryIndex] = {
          ...updatedCart[existingEntryIndex],
          variant: {
            ...updatedCart[existingEntryIndex].variant,
          },
        };

        return updatedCart;
      } else {
        return [...state, action.payload];
      }
    }
    case "REMOVE_PRODUCT":
      return state.filter(
        (entry) =>
          !(
            entry.product.id === action.payload.productId &&
            entry.variant.id === action.payload.variantId
          )
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

const initialState: CartEntry[] = [];

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState, () => {
    if (typeof window !== "undefined") {
      const localData = localStorage.getItem(STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: IProduct, variant: IProductVariant) => {
    dispatch({ type: "ADD_PRODUCT", payload: { product, variant } });
  };

  const removeProduct = (productId: number, variantId: number) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: { productId, variantId } });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartState => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
