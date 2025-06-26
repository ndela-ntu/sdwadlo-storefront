import ProductCard from "@/components/product-card";
import PreviewProduct from "@/components/products/preview-product";
import IProduct from "@/models/product";
import { supabase } from "@/utils/supabase";
import { ChevronRight } from "lucide-react";

async function getProduct(id: number): Promise<IProduct | null> {
  const { data: product } = await supabase
    .from("product")
    .select(
      `*, product_variant(
      *,
      size(*),
      color(*),
      product(*)
    )`
    )
    .eq("id", id)
    .single();

  return product;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;
  const product = await getProduct(parseInt(awaitedParams.id));

  if (product) {
    return {
      title: product.name,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [product.product_variant.length && product.product_variant[0].image_urls],
        url: `https://sdwadlo.shop/products/${awaitedParams.id}`,
        type: "product",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description,
        images: [product.product_variant.length && product.product_variant[0].image_urls],
      },
    };
  }
}

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

  const { data: similarProducts, error: fetchSimilarProdError } = await supabase
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
    .eq("category_id", product.category_id);

  if (fetchProductError || fetchSimilarProdError) {
    return (
      <div>{`An error occurred: ${
        fetchProductError?.message || fetchSimilarProdError?.message
      }`}</div>
    );
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
      <div className="flex flex-col items-center justify-center w-full">
        <PreviewProduct product={product} />
      </div>
      <div className="border-b border-gray-500 my-2.5 md:my-5" />
      <div className="w-full flex flex-col space-y-2.5 items-start mb-5">
        <span className="font-semibold text-lg md:text-xl">Similar Items</span>
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
          {similarProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
