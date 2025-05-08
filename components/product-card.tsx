'use client';

import Image from "next/image";
import IProduct from "@/models/product";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }: { product: IProduct }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Filter variants by selected color or get all variants
  const filteredVariants = selectedColor
    ? product.product_variant.filter(v => v.color?.hex === selectedColor)
    : product.product_variant;

  // Get images from filtered variants
  const allImages = filteredVariants.flatMap(v => v.image_urls);
  const currentImage = allImages[currentImageIndex] || "/placeholder-image.svg";

  // Get unique colors
  const uniqueColors = Array.from(
    new Set(
      product.product_variant
        .filter(v => v.color)
        .map(v => v.color!.hex)
    )
  );

  // Price formatting
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="group">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Image navigation arrows if multiple images */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
            >
              &larr;
            </button>
            <button 
              onClick={(e) => {
                e.preventDefault();
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75"
            >
              &rarr;
            </button>
          </>
        )}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-black line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-black">
              {product.brand.name}
            </p>
          </div>
          <p className="text-sm font-medium text-black">
            {formattedPrice}
          </p>
        </div>

        {/* Color swatches if available */}
        {uniqueColors.length > 0 && (
          <div className="mt-2 flex gap-2">
            {uniqueColors.map(color => (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(selectedColor === color ? null : color);
                  setCurrentImageIndex(0);
                }}
                className={`h-5 w-5 rounded-full border ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}