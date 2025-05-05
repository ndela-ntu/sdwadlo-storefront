import BrandsCard from "@/components/brands-card";
import ItemsCard from "@/components/items-card";
import { supabase } from "@/utils/supabase";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const { data: brands, error: brandsError } = await supabase
    .from("brand")
    .select("*");
  const { data: categories, error: categoriesError } = await supabase
    .from("category")
    .select("*");
  const { data: tags, error: tagsError } = await supabase
    .from("tag")
    .select("*");

  if (brandsError || categoriesError || tagsError) {
    return (
      <div>{`An error occurred: ${
        brandsError?.message || categoriesError?.message || tagsError?.message
      }`}</div>
    );
  }

  return (
    <div className="flex flex-col p-2.5 space-y-2.5">
      <div className="flex flex-col px-2.5 md:px-5">
        <span className="text-xl md:text-2xl font-bold pb-2.5 md:pb-5 underline">
          Shop by Brand
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
          {brands.map((brand) => (
            <BrandsCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-eerie-black text-white py-2.5 px-2.5 md:py-5 md:px-5">
        <span className="text-xl md:text-2xl font-bold pb-2.5 md:pb-5 underline">
          Shop by Category
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
          {categories.map((category) => (
            <ItemsCard key={category.id} item={category} />
          ))}
        </div>
      </div>
      <div className="flex flex-col py-2.5 px-2.5 md:py-5 md:px-5">
        <span className="text-xl md:text-2xl font-bold pb-2.5 md:pb-5 underline">
          Shop by Collection
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
          {tags.map((tag) => (
            <ItemsCard key={tag.id} item={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
