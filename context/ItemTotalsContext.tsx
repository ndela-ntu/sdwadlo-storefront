"use client";

import React, { useContext, useEffect, useReducer } from "react";
import { ReactNode, createContext } from "react";

const STORAGE_KEY = "sdwadlo:itemTotals";

interface ItemTotal {
  id: number;
  total: number;
}

interface ItemTotalsState {
  itemTotals: ItemTotal[];
  addItemTotal: (itemTotal: ItemTotal) => void;
  removeItemTotal: (id: number) => void;
  clearItemTotals: () => void;
  updateItemTotal: (id: number, total: number) => void;
}

const ItemTotalsContext = createContext<ItemTotalsState | undefined>(undefined);

type Action =
  | { type: "ADD_ITEM_TOTAL"; payload: ItemTotal }
  | { type: "REMOVE_ITEM_TOTAL"; payload: { id: number } }
  | { type: "CLEAR_ITEM_TOTALS" }
  | { type: "UPDATE_ITEM_TOTAL"; payload: { id: number; total: number } };

const itemTotalReducer = (state: ItemTotal[], action: Action): ItemTotal[] => {
  switch (action.type) {
    case "ADD_ITEM_TOTAL": {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id 
            ? { ...item, total: item.total + action.payload.total } 
            : item
        );
      } else {
        return [...state, action.payload];
      }
    }
    case "UPDATE_ITEM_TOTAL":
      return state.map((item) =>
        item.id === action.payload.id 
          ? { ...item, total: action.payload.total } 
          : item
      );
    case "REMOVE_ITEM_TOTAL":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_ITEM_TOTALS":
      return [];
    default:
      return state;
  }
};

const getInitialState = (): ItemTotal[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const localData = localStorage.getItem(STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error("Failed to parse item totals from localStorage", error);
    return [];
  }
};

interface ItemTotalsProviderProps {
  children: ReactNode;
}

export const ItemTotalsProvider: React.FC<ItemTotalsProviderProps> = ({
  children,
}) => {
  const [itemTotals, dispatch] = useReducer(itemTotalReducer, [], getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemTotals));
    } catch (error) {
      console.error("Failed to save item totals to localStorage", error);
    }
  }, [itemTotals]);

  const addItemTotal = (itemTotal: ItemTotal) => {
    dispatch({ type: "ADD_ITEM_TOTAL", payload: itemTotal });
  };

  const updateItemTotal = (id: number, total: number) => {
    dispatch({ type: "UPDATE_ITEM_TOTAL", payload: { id, total } });
  };

  const removeItemTotal = (id: number) => {
    dispatch({ type: "REMOVE_ITEM_TOTAL", payload: { id } });
  };

  const clearItemTotals = () => {
    dispatch({ type: "CLEAR_ITEM_TOTALS" });
  };

  return (
    <ItemTotalsContext.Provider
      value={{ 
        itemTotals, 
        addItemTotal, 
        removeItemTotal, 
        clearItemTotals,
        updateItemTotal 
      }}
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