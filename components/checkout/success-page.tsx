"use client";

import { useCart } from "@/context/CartContext";
import { useItemTotals } from "@/context/ItemTotalsContext";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const { clearItemTotals } = useItemTotals();

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col items-center justify-center w-full pt-5 space-y-2.5">
      <div className="flex items-center space-x-2.5">
        <span>Your order has been successfully placed</span>
        <span className="text-white bg-chest-nut p-2.5 rounded-full">
          <Check className="h-6 w-6" />
        </span>
      </div>
      <Link
        href="/products"
        className="text-white flex items-center bg-chest-nut p-2.5 rounded-lg"
      >
        <span>Continue Shopping</span>
        <span>
          <ArrowRight className="h-6 w-6" />
        </span>
      </Link>
    </div>
  );
}
