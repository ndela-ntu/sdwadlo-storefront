import CollectionSection from "@/components/collection/collection-section";
import IProduct from "@/models/product";
import ITag from "@/models/tag";
import { supabase } from "@/utils/supabase";
import { ChevronRight } from "lucide-react";

export default async function ({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;

  const { data: tagData, error: fetchTagError } = await supabase
    .from("tag")
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
        product_tag!inner(
          tag!inner(*)
        )
      `
    )
    .eq("product_tag.tag_id", awaitedParams.id)
    .eq("status", "Listed")
    .eq("brand.status", "Active")
    .eq("category.status", "Active")
    .eq("product_tag.tag.status", "Active");

  if (fetchProdError || fetchTagError) {
    return (
      <div>{`An error occurred: ${
        fetchProdError?.message || fetchTagError?.message
      }`}</div>
    );
  }

  const products = productData as IProduct[];
  const collection = tagData as ITag;

  return (
    <div className="px-2 flex flex-col space-y-2.5">
      <div className="flex space-x-1 md:space-x-2.5 items-center">
        <span className="font-bold text:lg md:text-xl">Collection</span>
        <span>
          <ChevronRight />
        </span>
        <span className="text:lg md:text-xl">{collection.name}</span>
      </div>
      <CollectionSection products={products} />
    </div>
  );
}
