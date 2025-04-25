import { supabase } from "./supabase";

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase.from("product").select(`
        *,
        brand (*),
        category (*),
        subcategory (*),
        material (*)
      `);

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  const term = searchTerm.toLowerCase();

  // Filter locally across all fields
  return data.filter((product) =>
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
