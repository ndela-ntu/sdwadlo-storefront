import CategorySection from "@/components/category/category-section";
import ICategory from "@/models/category";
import IProduct from "@/models/product";
import { supabase } from "@/utils/supabase";
import { ChevronRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;

  const { data: categoryData, error: fetchCatError } = await supabase
    .from("category")
    .select(`*, subcategory(*)`)
    .eq("id", awaitedParams.id)
    .single();
    
  const { data: productData, error: fetchProdError } = await supabase
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
    .eq("category_id", awaitedParams.id)
    .eq("status", "Listed")
    .eq("brand.status", "Active")
    .eq("category.status", "Active")
    .eq("product_tag.tag.status", "Active");

  if (fetchProdError || fetchCatError) {
    return (
      <div>{`An error occurred: ${
        fetchProdError?.message || fetchCatError?.message
      }`}</div>
    );
  }

  const products = productData as IProduct[];
  const category = categoryData as ICategory;

  return (
    <div className="px-2 flex flex-col space-y-2.5">
      <div className="flex space-x-1 md:space-x-2.5 items-center">
        <span className="font-bold text:lg md:text-xl">Category</span>
        <span><ChevronRight /></span>
        <span className="text:lg md:text-xl">{category.name}</span>
      </div>
      <CategorySection initialProducts={products} subcategories={category.subcategory} />
    </div>
  );
}
