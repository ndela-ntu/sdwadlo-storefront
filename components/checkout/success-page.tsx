"use client";

import { useCart } from "@/context/CartContext";
import { useItemTotals } from "@/context/ItemTotalsContext";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const { clearItemTotals } = useItemTotals();
  const [isCleared, setIsCleared] = useState(false);

  useEffect(() => {
    if (!isCleared) {
      console.log('Clearing cart and item totals');
      clearCart();
      clearItemTotals();
      setIsCleared(true);
      
      localStorage.removeItem("sdwadlo:cart");
      localStorage.removeItem("sdwadlo:itemTotals");
    }
  }, [clearCart, clearItemTotals, isCleared]);

  return (
    <div className="flex flex-col items-center justify-center w-full py-10 space-y-2.5">
      <div className="flex items-center space-x-2.5">
        <span>Your order has been successfully placed</span>
        <span className="text-white bg-chest-nut p-2 rounded-full">
          <Check className="h-5 w-5" />
        </span>
      </div>
      <Link
        href="/products"
        className="text-white flex items-center bg-chest-nut p-2.5 rounded-lg hover:bg-chest-nut-dark transition-colors"
      >
        <span>Continue Shopping</span>
        <ArrowRight className="h-6 w-6 ml-2" />
      </Link>
    </div>
  );
}