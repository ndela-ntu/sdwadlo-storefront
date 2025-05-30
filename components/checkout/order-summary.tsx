"use client";

import { useCart } from "@/context/CartContext";
import { useItemTotals } from "@/context/ItemTotalsContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OrderSummary() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const { cart, clearCart } = useCart();
  const { itemTotals, clearItemTotals } = useItemTotals();

  useEffect(() => {
    console.log("Current cart:", cart);
    console.log("Current itemTotals:", itemTotals);

    if (itemTotals.length > 0) {
      const calculatedTotal = itemTotals.reduce((a, v) => a + v.total, 0);
      console.log("Calculated total:", calculatedTotal);
      setTotal(calculatedTotal);
    } else {
      console.warn("itemTotals is empty, setting total to 0");
      setTotal(0);
    }
  }, [itemTotals, cart]);

  if (!cart || !itemTotals) {
    console.error("Cart or itemTotals context not available");
    return <div>Loading cart...</div>;
  }

  return (
    <div className="flex flex-col w-full md:w-[30%]">
      <div
        onClick={() => setIsSummaryOpen(!isSummaryOpen)}
        className="flex justify-between bg-silver text-white md:text-lg p-3 md:p-5 cursor-pointer"
      >
        <div className="flex space-x-1 md:space-x-2 items-center">
          <span>Order Summary</span>
          {isSummaryOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
        <span className="font-semibold">R{total.toFixed(2)}</span>
      </div>

      {isSummaryOpen && (
        <div className="flex flex-col bg-eerie-black text-white p-2 md:p-4">
          {cart.length > 0 ? (
            cart.map((entry, i) => {
              const itemTotal = itemTotals.find(
                (item) => item.id === entry.variant.id
              );
              const quantity = itemTotal
                ? itemTotal.total / entry.product.price
                : 0;

              return (
                <div
                  key={`${entry.product.id}-${entry.variant.id}`}
                  className="flex items-center justify-between space-x-2 md:space-x-4 mb-4 last:mb-0"
                >
                  <div className="relative aspect-square w-[25%] md:w-[20%] rounded-lg">
                    <Image
                      src={entry.variant.image_urls[0]}
                      alt={`${entry.product.name} - ${
                        entry.variant.color?.name || ""
                      }`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="font-semibold flex items-center justify-between">
                      <span>{entry.product.name}</span>
                      <span>R{itemTotal?.total?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex space-x-1 text-sm">
                      {entry.variant.size && (
                        <span>{entry.variant.size.name}</span>
                      )}
                      {entry.variant.size && entry.variant.color && (
                        <span>•</span>
                      )}
                      {entry.variant.color && (
                        <span>{entry.variant.color.name}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm md:text-base p-2 bg-silver text-white rounded-full">
                    x{quantity.toFixed(0)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">Your cart is empty</div>
          )}
        </div>
      )}
    </div>
  );
}
