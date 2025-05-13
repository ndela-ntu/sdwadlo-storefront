"use client";

import IProduct from "@/models/product";
import IProductVariant from "@/models/product-variant";
import Image from "next/image";
import { useState } from "react";

export default function ProductCard({ product }: { product: IProduct }) {
  const [variants, setVariants] = useState<IProductVariant[]>(
    product.product_variant
  );
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number>(0);
  //const currentVariant = f

  return (
    <div className="md:border rounded-lg md:shadow-md overflow-hidden bg-white">
      <div className="p-2.5 md:text-xl font-semibold">
        {product.brand.name}
      </div>
      <div className="relative aspect-square overflow-hidden">
        <div>
          <Image
            src={variants[currentVariantIndex].image_urls[0]}
            alt={`${product.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="flex flex-col p-2.5">
        <span className="font-semibold md:text-xl">{product.name}</span>
        <span className="text-sm md:text-base">R{product.price}</span>
      </div>
      {product.type === "Clothing" && (
        <div className="flex items-center space-x-1 md:space-x-2 px-2.5 pb-2.5">
          {variants.map((variant) => {
            console.log(variant.color?.hex);
            return (
              <div
                key={variant.id}
                className="w-5 h-5 rounded-full border-2"
                style={{ backgroundColor: variant.color?.hex }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
