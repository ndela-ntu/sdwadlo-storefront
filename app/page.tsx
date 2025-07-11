import BrandsCard from "@/components/brands-card";
import BrandsCarousel from "@/components/brands-carousel";
import ItemsCard from "@/components/items-card";
import ProductCard from "@/components/product-card";
import { supabase } from "@/utils/supabase";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// app/page.tsx
export const metadata = {
  title: 'Sdwadlo - The Home of Kasi Brands',
  description: 'Shop the our proudly Kasi brands at Sdwadlo. Affordable styles for everyone.',
  keywords: 'clothing, fashion, shop, online store, sdwadlo',
  openGraph: {
    title: 'Sdwadlo Shop',
    description: 'Discover trendy and affordable fashion.',
    url: 'https://sdwadlo.shop',
    siteName: 'Sdwadlo',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: brands, error: brandsError } = await supabase
    .from("brand")
    .select("*")
    .eq("status", "Active");

  const { data: categories, error: categoriesError } = await supabase
    .from("category")
    .select("*")
    .eq("status", "Active");

  const { data: tags, error: tagsError } = await supabase
    .from("tag")
    .select("*")
    .eq("status", "Active");

  const { data: products, error: productsError } = await supabase
    .from("product")
    .select(
      `
    *,
    brand!inner(*),
    category!inner(*),
    subcategory(*),
    material(*),
    product_variant(
      *,
      size(*),
      color(*),
      product(*)
    ),
    product_tag(
      tag!inner(*)
    )
  `
    )
    .eq("status", "Listed")
    .eq("brand.status", "Active")
    .eq("category.status", "Active")
    .eq("product_tag.tag.status", "Active")
    .limit(6);

  if (brandsError || categoriesError || tagsError || productsError) {
    return (
      <div className="text-red-500">{`An error occurred: ${
        brandsError?.message ||
        categoriesError?.message ||
        tagsError?.message ||
        productsError?.message
      }`}</div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:space-y-none w-full">
        <div className="flex flex-col md:space-y-0 w-full">
          <div className="flex flex-col p-2.5 md:p-5 bg-eerie-black text-white max-h-fit w-full">
            <span className="text-lg md:text-2xl font-bold pb-2.5 md:pb-5">
              Shop by Category
            </span>
            <div className="grid grid-cols-2 gap-2.5 md:gap-5">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`aspect-square md:w-full md:h-full`}
                >
                  <ItemsCard
                    item={{ ...category, type: "Category" }}
                    className={`w-full h-full`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white flex flex-col p-2.5 md:p-5 text-black w-full max-h-fit border border-silver">
            <span className="text-lg md:text-2xl font-bold pb-2.5 md:pb-5 ">
              Proudly Kasi Items
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex items-center justify-end space-x-2 text-lg md:text-2xl font-bold py-2.5 underline">
              <Link href="/products">View More</Link>
              <span>
                <ArrowRight />
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-2.5 md:p-5 bg-chest-nut text-white max-h-fit md:w-[30%] md:pb-14">
          <span className="text-lg md:text-2xl font-bold pb-2.5 md:pb-5 ">
            Featured Brands
          </span>
          <BrandsCarousel brands={brands} />
        </div>
      </div>
      <div className="flex flex-col p-2.5 md:p-5 bg-eerie-black text-white">
        <span className="text-lg md:text-2xl font-bold pb-2.5 md:pb-5 ">
          Shop Collections
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
          {tags.map((tag) => (
            <ItemsCard key={tag.id} item={{ ...tag, type: "Tag" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
