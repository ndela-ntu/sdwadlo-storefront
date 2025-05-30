"use client";

import { useEffect, useState, useRef } from "react";

export default function QuantitySelector({
  maxQuantity,
  onChangeCB,
  initialQuantity = 1,
}: {
  maxQuantity: number;
  onChangeCB?: (quantity: number) => void;
  initialQuantity?: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const prevQuantityRef = useRef(quantity);

  useEffect(() => {
    if (prevQuantityRef.current !== quantity && onChangeCB) {
      onChangeCB(quantity);
      prevQuantityRef.current = quantity;
    }
  }, [quantity, onChangeCB]);

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-chest-nut rounded-4xl text-white max-w-fit">
      <button
        className="border-r border-white font-bold px-3"
        onClick={decrementQuantity}
      >
        -
      </button>
      <span className="">{quantity}</span>
      <button
        className="border-l border-white font-bold px-3"
        onClick={incrementQuantity}
      >
        +
      </button>
    </div>
  );
}