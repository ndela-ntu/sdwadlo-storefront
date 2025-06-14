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
import BrandsCard from "./brands-card";

export default function BrandsCarousel({ brands }: { brands: IBrand[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth >= 768 ? "vertical" : "horizontal");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        opts={{ align: "center", loop: true }}
        className="w-full h-full relative group"
        orientation={orientation}
      >
        <CarouselContent className="-mt-1 h-full">
          {brands.map((brand) => (
            <CarouselItem key={brand.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pt-1">
              <BrandsCard brand={brand} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100" />
        <CarouselNext className="hidden md:flex bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all opacity-0 group-hover:opacity-100" />
      </Carousel>

      {/* Bottom indicator dots for all screens */}
      <div className="md:hidden mt-1 flex items-center justify-center space-x-2.5">
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
