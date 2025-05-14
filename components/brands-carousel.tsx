"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import IBrand from "@/models/brand";

export default function BrandsCarousel({ brands }: { brands: IBrand[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const placeholderImage = "/placeholder-image.svg"; // Update with your actual placeholder path

  const onInit = useCallback(() => {
    setCount(0);
    setCurrent(0);
  }, []);

  const onScroll = useCallback(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    onScroll();
    api.on("init", onInit);
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => {
      api.off("init", onInit);
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
    };
  }, [api, onInit, onScroll]);

  return (
    <div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        setApi={setApi}
        opts={{ align: "center" }}
        className="w-full h-full"
      >
        <CarouselContent className="">
          {brands.map((brand) => {
            const isVideo = brand.media_url?.match(/\.(mp4|webm|mov|avi)$/i);

            return (
              <CarouselItem
                key={brand.id}
                className="basis-1/2">
                <Link
                  href={`/brands/${brand.id}`}
                  className="relative block aspect-square overflow-hidden rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Brand Logo - Top Left */}
                  <div className="absolute top-1 left-1 z-10 w-16 h-16 bg-transparent p-1 rounded-md shadow-sm aspect-square">
                    <div className="relative w-full h-full">
                      <Image
                        src={brand.logo_url}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  </div>

                  {/* Media - Center */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    {brand.media_url ? (
                      isVideo ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source
                            src={brand.media_url}
                            type={`video/${brand.media_url.split(".").pop()}`}
                          />
                        </video>
                      ) : (
                        <Image
                          src={brand.media_url}
                          alt={`${brand.name} media`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      )
                    ) : (
                      <Image
                        src={placeholderImage}
                        alt={`${brand.name} placeholder`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>

                  {/* Brand Name - Bottom Left */}
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white font-bold text-xl md:text-2xl">
                      {brand.name}
                    </h3>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <div className="mt-1 flex items-center justify-center space-x-2.5">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === current ? "bg-white w-4" : "bg-white/65"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
