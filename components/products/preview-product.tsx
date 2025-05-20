"use client";

import IProduct from "@/models/product";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import IProductVariant from "@/models/product-variant";
import { useCart } from "@/context/CartContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PreviewProduct({ product }: { product: IProduct }) {
  const { cart, addProduct, removeProduct, clearCart } = useCart();
  const isClothing = product.type === "Clothing";
  const variants = product.product_variant;

  const clothingVariants = variants.filter(
    (v): v is Extract<IProductVariant, { color: object }> => v.color != null
  );

  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    clothingVariants[0]?.color?.id
  );
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    undefined
  );
  const [currentVariant, setCurrentVariant] = useState<
    IProductVariant | undefined
  >(undefined);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleAddToCartClick = () => {
    if (!selectedSize && isClothing) {
      setShowTooltip(true);

      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    } else {
      if (isClothing) {
        const variant = clothingVariants.find(
          (variant) =>
            variant.color.id === selectedColor &&
            variant.size.id === selectedSize
        );
        if (variant) {
          addProduct(product, variant);
          setCurrentVariant(variant);
        }
      } else {
        const variant = variants.find(
          (variant) =>
            variant.product.type === "Accessory" &&
            variant.product.id === product.id &&
            variant.size === null &&
            variant.color === null
        );
        if (variant) {
          addProduct(product, variant);
          setCurrentVariant(variant);
        }
      }
    }
  };

  const handleRemoveFromCartClick = () => {
    if (currentVariant) {
      removeProduct(product.id, currentVariant.id);
    }
  };

  useEffect(() => {
    setCurrentVariant(
      variants.find(
        (variant) =>
          variant.color?.id === selectedColor && variant.size?.id === selectedSize
      )
    );
  }, [selectedSize, selectedColor]);

  // useEffect(() => {
  //   clearCart();
  // }, []);

  useEffect(() => {
    setSelectedSize(undefined);
  }, [selectedColor]);

  const colorVariants = Array.from(
    new Map(clothingVariants.map((v) => [v.color?.name, v])).values()
  );

  const selectedVariants = isClothing
    ? clothingVariants.filter((v) => v.color?.id === selectedColor)
    : variants;

  const selectedImages = selectedVariants.flatMap((v) => v.image_urls);
  const [imageIndex, setImageIndex] = useState(0);
  const currentImage =
    selectedImages[imageIndex] || selectedVariants[0]?.image_urls[0];

  const handleNext = () => {
    setImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const handlePrev = () => {
    setImageIndex(
      (prev) => (prev - 1 + selectedImages.length) % selectedImages.length
    );
  };

  return (
    <div className="p-4 md:p-8 w-full h-full md:w-[75%] shadow-lg rounded-lg my-2.5">
      <div className="flex flex-col w-full h-full items-center justify-center md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        {/* Image section */}
        <div className="w-full md:w-1/3 relative">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            {currentImage && (
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}

            {Array.from(new Set(selectedImages)).length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Color thumbnails (only for clothing) */}
          {isClothing && (
            <div className="grid grid-cols-4 gap-2">
              {colorVariants.map((variant, index) => {
                const image = variant.image_urls[0];
                const isSelected = variant.color?.id === selectedColor;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(variant.color?.id);
                      setImageIndex(0);
                    }}
                    className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden border-2 ${
                      isSelected ? "border-chest-nut" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Color ${variant.color?.name}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-2.5 w-full md:w-1/3">
          <div className="flex items-center space-x-2.5 mb-4">
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

          <div className="border-b border-gray-500" />

          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-bold text-black">
              {product.name}
            </h1>
            <div className="md:text-xl font-semibold text-black">
              R{product.price.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-gray-600 text-sm mb-1">{product.description}</p>
            <div className="flex flex-wrap space-x-2 items-center">
              <div>
                {product.product_tag.map((tagData) => (
                  <span
                    key={tagData.tag.name}
                    className="bg-silver text-white text-sm p-1.5 rounded-lg"
                  >
                    #{tagData.tag.name}
                  </span>
                ))}
              </div>
              <span className="bg-silver text-white text-sm p-1.5 rounded-lg">
                100% {product.material.name}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Color selection (clothing only) */}
            {isClothing && colorVariants.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedColor(variant.color?.id);
                       //setCurrentVariant(undefined);
                        setImageIndex(0);
                      }}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        selectedColor === variant.color?.id
                          ? "bg-chest-nut text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {variant.color?.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection (clothing only) */}
            {isClothing && selectedColor && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Set(
                      clothingVariants
                        .filter((v) => v.color?.id === selectedColor)
                        .map((v) => v.size?.name)
                    )
                  )
                    .filter(Boolean)
                    .map((size, index) => {
                      const matchingVariant = clothingVariants.find(
                        (v) =>
                          v.color?.id === selectedColor && v.size?.name === size
                      );

                      const isOutOfStock = matchingVariant?.quantity === 0;

                      return (
                        <button
                          key={index}
                          disabled={isOutOfStock}
                          onClick={() => {
                            setSelectedSize(matchingVariant?.size.id);
                          }}
                          className={`px-3 py-1 text-sm rounded-full border ${
                            selectedSize === matchingVariant?.size.id &&
                            "bg-chest-nut text-white"
                          } ${
                            isOutOfStock
                              ? "bg-silver text-white line-through cursor-not-allowed"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <TooltipProvider>
            <Tooltip open={showTooltip}>
              <TooltipTrigger asChild>
                {currentVariant && cart.find(
                  (entry) =>
                    entry.product.id === product.id &&
                    entry.variant.id === currentVariant.id
                ) ? (
                  <button
                    onClick={handleRemoveFromCartClick}
                    className="w-full md:w-auto bg-chest-nut text-white py-3 px-8 rounded-md hover:bg-silver hover:text-black transition-colors"
                  >
                    Remove From Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCartClick}
                    className="w-full md:w-auto bg-chest-nut text-white py-3 px-8 rounded-md hover:bg-silver hover:text-black transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Please select a size</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
