import PreviewProduct from "@/components/products/preview-product";
import { supabase } from "@/utils/supabase";
import { ChevronRight } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const { data: product, error: fetchProductError } = await supabase
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
    .eq("id", awaitedParams.id)
    .single();

  if (fetchProductError) {
    return <div>{`An error occurred: ${fetchProductError?.message}`}</div>;
  }

  return (
    <div className="px-2 flex flex-col space-y-2.5">
      <div className="flex space-x-1 md:space-x-2.5 items-center">
        <span className="font-bold text:lg md:text-xl">Product</span>
        <span>
          <ChevronRight />
        </span>
        <span className="text:lg md:text-xl">{product.name}</span>
      </div>
      <PreviewProduct product={product} />
    </div>
  );
}
