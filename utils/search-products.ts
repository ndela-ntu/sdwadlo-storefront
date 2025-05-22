import IProduct from "@/models/product";
import { supabase } from "./supabase";

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase
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
    .eq("product_tag.tag.status", "Active");

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  const product = data as IProduct[];
  const term = searchTerm.toLowerCase();

  // Filter locally across all fields
  return product.filter((product) =>
    [
      product.name,
      product.description,
      product.brand?.name,
      product.category?.name,
      product.subcategory?.name,
      product.material?.name,
    ].some((field) => field?.toLowerCase().includes(term))
  );
};
