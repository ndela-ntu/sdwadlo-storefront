'use client';

import IProduct from "@/models/product";
import Image from "next/image";
import { useState } from "react";

export default function PreviewProduct({ product }: { product: IProduct }) {
  const [selectedImage, setSelectedImage] = useState(
    product.product_variant[0]?.image_urls[0]
  );

  // Get unique variant images
  const variantImages = Array.from(
    new Set(
      product.product_variant.flatMap((variant) => variant.image_urls)
    )
  );

  return (
    <div className="mx-auto p-4 md:p-8 w-full h-full shadow-lg rounded-lg my-2.5">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images - Left/Top */}
        <div className="w-full md:w-1/2">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Variant Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {variantImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${
                  selectedImage === image
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`Variant ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info - Right/Bottom */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-2 mb-4">
            {product.brand?.logo_url && (
              <div className="relative w-10 h-10">
                <Image
                  src={product.brand.logo_url}
                  alt={product.brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-sm font-medium text-gray-600">
              {product.brand?.name}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="text-xl font-semibold text-gray-900 mb-4">
            R{product.price.toFixed(2)}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variant Selection */}
          <div className="space-y-4 mb-6">
            {/* Color Variants */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    product.product_variant.map((v) => v.color?.name)
                  )
                ).map((color, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm rounded-full border border-gray-300 hover:border-gray-400"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Variants */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    product.product_variant.map((v) => v.size?.name)
                  )
                ).map((size, index) => (
                  <button
                    key={index}
                    className="px-3 py-1 text-sm rounded-full border border-gray-300 hover:border-gray-400"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto bg-chest-nut text-white py-3 px-8 rounded-md hover:bg-silver hover:text-black transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
