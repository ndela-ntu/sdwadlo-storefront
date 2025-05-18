import IBrand from "@/models/brand";
import IProduct from "@/models/product";
import { supabase } from "@/utils/supabase";
import { ChevronRight } from "lucide-react";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;

  const { data: brandData, error: fetchBrandError } = await supabase
    .from("brand")
    .select(`*`)
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
    .eq("brand_id", awaitedParams.id) // <-- changed from category_id
    .eq("status", "Listed")
    .eq("brand.status", "Active")
    .eq("category.status", "Active")
    .eq("product_tag.tag.status", "Active");

  if (fetchProdError || fetchBrandError) {
    return (
      <div>{`An error occurred: ${
        fetchProdError?.message || fetchBrandError?.message
      }`}</div>
    );
  }

  const products = productData as IProduct[];
  const brand = brandData as IBrand;

  return (
    <div className="px-2 flex flex-col space-y-2.5">
      <div className="flex space-x-1 md:space-x-2.5 items-center">
        <span className="font-bold text:lg md:text-xl">Brand</span>
        <span>
          <ChevronRight />
        </span>
        <span className="text:lg md:text-xl">{brand.name}</span>
      </div>
    </div>
  );
}
