"use client";

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
  quantity: number;
}

interface CartState {
  cart: CartEntry[];
  addProduct: (product: IProduct, variant: IProductVariant, quantity?: number) => void;
  removeProduct: (productId: number, variantId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, variantId: number, quantity: number) => void;
}

type Action =
  | { type: "ADD_PRODUCT"; payload: CartEntry }
  | {
      type: "REMOVE_PRODUCT";
      payload: { productId: number; variantId: number };
    }
  | { type: "CLEAR_CART" }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: number; variantId: number; quantity: number };
    };

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
          quantity: updatedCart[existingEntryIndex].quantity + (action.payload.quantity || 1),
        };
        return updatedCart;
      } else {
        return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
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
    case "UPDATE_QUANTITY": {
      return state.map((entry) => {
        if (
          entry.product.id === action.payload.productId &&
          entry.variant.id === action.payload.variantId
        ) {
          return {
            ...entry,
            quantity: action.payload.quantity,
          };
        }
        return entry;
      });
    }
    default:
      return state;
  }
};

const initialState: CartEntry[] = [];

interface CartProviderProps {
  children: ReactNode;
}
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on client only
  useEffect(() => {
    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        // Replace state with localStorage data
        parsed.forEach((entry: CartEntry) => {
          dispatch({ 
            type: "ADD_PRODUCT", 
            payload: { 
              product: entry.product, 
              variant: entry.variant, 
              quantity: entry.quantity 
            } 
          });
        });
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addProduct = (product: IProduct, variant: IProductVariant, quantity: number = 1) => {
    dispatch({ 
      type: "ADD_PRODUCT", 
      payload: { product, variant, quantity } 
    });
  };

  const removeProduct = (productId: number, variantId: number) => {
    dispatch({ type: "REMOVE_PRODUCT", payload: { productId, variantId } });
  };

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const updateQuantity = (productId: number, variantId: number, quantity: number) => {
    dispatch({ 
      type: "UPDATE_QUANTITY", 
      payload: { productId, variantId, quantity } 
    });
  };

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addProduct, 
        removeProduct, 
        clearCart, 
        updateQuantity 
      }}
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