"use client";

import { useCart } from "@/context/CartContext";
import { useItemTotals } from "@/context/ItemTotalsContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OrderSummary() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const { cart } = useCart();
  const { itemTotals } = useItemTotals();

  useEffect(() => {
    setTotal(itemTotals.reduce((a, v) => a + v.total, 0));
  }, [itemTotals]);

  return (
    <div className="flex flex-col w-full md:w-[30%]">
      <div
        onClick={() => {
          setIsSummaryOpen(!isSummaryOpen);
        }}
        className="flex justify-between bg-silver text-white md:text-lg p-3 md:p-5"
      >
        <div className="flex space-x-1 md:space-x-2 items-center">
          <span>Order Summary</span>
          <div>{isSummaryOpen ? <ChevronUp /> : <ChevronDown />}</div>
        </div>
        <span className="font-semibold">R{total}</span>
      </div>
      {isSummaryOpen && (
        <div className="flex flex-col bg-eerie-black text-white p-2 md:p-4">
          {cart.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between space-x-2 md:space-x-4"
            >
              <div className="relative aspect-square w-[25%] md:w-[20%] rounded-lg">
                <Image
                  src={entry.variant.image_urls[0]}
                  alt="Image of item"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="font-semibold flex items-center justify-between">
                  <span>{entry.product.name}</span>
                  <span>
                    R
                    {
                      itemTotals.find(
                        (itemTotal) => itemTotal.id === entry.variant.id
                      )?.total
                    }
                  </span>
                </div>
                <div className="flex space-x-1">
                  {entry.variant.size && <span>{entry.variant.size.name}</span>}
                  {entry.variant.size && entry.variant.color && <span>•</span>}
                  {entry.variant.color && (
                    <span>{entry.variant.color.name}</span>
                  )}
                </div>
              </div>
              <span className="text-sm md:text-base p-2 bg-silver text-white rounded-full">
                x{(itemTotals.find(
                  (itemTotal) => itemTotal.id === entry.variant.id
                )?.total || 0) / entry.product.price}
              </span>
            </div>
          ))}
          <div></div>
        </div>
      )}
    </div>
  );
}
