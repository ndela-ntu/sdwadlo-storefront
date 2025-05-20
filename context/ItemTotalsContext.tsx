'use client';

import React, { useContext, useEffect, useReducer } from "react";
import { ReactNode, createContext } from "react";

interface ItemTotal {
  id: number;
  total: number;
}

interface ItemTotalsState {
  itemTotals: ItemTotal[];
  addItemTotal: (itemTotal: ItemTotal) => void;
  removeItemTotal: (id: number) => void;
  clearItemTotals: () => void;
}

const ItemTotalsContext = createContext<ItemTotalsState | undefined>(undefined);

type Action =
  | { type: "ADD_ITEM_TOTAL"; payload: ItemTotal }
  | { type: "REMOVE_ITEM_TOTAL"; payload: { id: number } }
  | { type: "CLEAR_ITEM_TOTAL" };

const itemTotalReducer = (state: ItemTotal[], action: Action): ItemTotal[] => {
  switch (action.type) {
    case "ADD_ITEM_TOTAL": {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id ? { ...item } : item
        );
      } else {
        return [...state, { ...action.payload }];
      }
    }
    case "REMOVE_ITEM_TOTAL":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_ITEM_TOTAL":
      return [];
    default:
      return state;
  }
};

const initialState: ItemTotal[] = [];

interface ItemTotalsProviderProps {
  children: ReactNode;
}

export const ItemTotalsProvider: React.FC<ItemTotalsProviderProps> = ({
  children,
}) => {
  const [itemTotals, dispatch] = useReducer(
    itemTotalReducer,
    initialState,
    () => {
      if (typeof window !== "undefined") {
        const localData = localStorage.getItem("itemTotals");
        return localData ? JSON.parse(localData) : [];
      }

      return initialState;
    }
  );

  useEffect(() => {
    localStorage.setItem("itemTotals", JSON.stringify(itemTotals));
  }, [itemTotals]);

  const addItemTotal = (itemTotal: ItemTotal) =>
    dispatch({ type: "ADD_ITEM_TOTAL", payload: itemTotal });
  const removeItemTotal = (id: number) =>
    dispatch({ type: "REMOVE_ITEM_TOTAL", payload: { id } });
  const clearItemTotals = () => dispatch({ type: "CLEAR_ITEM_TOTAL" });

  return (
    <ItemTotalsContext.Provider
      value={{ itemTotals, addItemTotal, removeItemTotal, clearItemTotals }}
    >
      {children}
    </ItemTotalsContext.Provider>
  );
};

export const useItemTotals = (): ItemTotalsState => {
  const context = useContext(ItemTotalsContext);

  if (!context) {
    throw new Error("useItemTotals must be used within an ItemTotalsProvider");
  }

  return context;
};
