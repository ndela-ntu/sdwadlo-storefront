"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IProduct from "@/models/product";
import IProductVariant from "@/models/product-variant";

interface ProductCardProps {
  product: IProduct;
}

// Helper type guard for clothing variants
function isClothingVariant(
  variant: IProductVariant
): variant is IProductVariant & {
  color: { hex: string; name: string };
  size: { name: string };
} {
  return variant.product && variant.product.type === "Clothing";
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.type === "Clothing" &&
      product.product_variant[0] &&
      isClothingVariant(product.product_variant[0])
      ? product.product_variant[0].color.hex
      : null
  );

  // Filter variants by selected color if product is clothing
  const filteredVariants =
    product.type === "Clothing" && selectedColor
      ? product.product_variant.filter(
          (variant) =>
            isClothingVariant(variant) && variant.color.hex === selectedColor
        )
      : product.product_variant;

  const currentVariant =
    filteredVariants[currentVariantIndex] || product.product_variant[0];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentVariant.image_urls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentVariant.image_urls.length - 1 ? 0 : prev + 1
    );
  };

  const handleColorClick = (colorHex: string) => {
    setSelectedColor(colorHex);
    setCurrentVariantIndex(0);
    setCurrentImageIndex(0);
  };

  // Get unique colors for clothing products
  const uniqueColors =
    product.type === "Clothing"
      ? product.product_variant
          .filter(isClothingVariant) // Ensure we only process clothing variants
          .reduce<Array<{ hex: string; name: string }>>((acc, variant) => {
            // Check if this color already exists in our accumulator
            if (!acc.some((color) => color.hex === variant.color.hex)) {
              acc.push(variant!.color);
            }
            return acc;
          }, [])
      : [];

  return (
    <div className="md:border rounded-lg overflow-hidden md:not-last:shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="p-2.5 md:text-lg font-semibold text-gray-900">{product.brand.name}</div>
      <div className="relative aspect-square overflow-hidden">
        {currentVariant.image_urls.map((url, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-300 ${
              idx === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={url}
              alt={`${product.name} - ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}

        {/* Navigation Arrows */}
        {currentVariant.image_urls.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10 hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-md z-10 hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {product.type === "Clothing" && uniqueColors.length > 0 && (
        <div className="px-4 py-2 flex gap-2">
          {uniqueColors.map((color) => (
            <button
              key={color.hex}
              onClick={() => handleColorClick(color.hex)}
              className={`w-5 h-5 rounded-full border ${
                selectedColor === color.hex
                  ? "ring-2 ring-offset-2 ring-gray-400"
                  : ""
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={`Select color ${color.name}`}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col p-2.5">
        <span className="font-semibold md:text-lg text-gray-900">{product.name}</span>
        <span className="text-sm md:text-base">R{product.price}</span>
      </div>
    </div>
  );
};

export default ProductCard;