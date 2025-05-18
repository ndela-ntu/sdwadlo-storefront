"use client";

import IProduct from "@/models/product";
import ISubcategory from "@/models/subcategory";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductCard from "../product-card";
import { Loader2 } from "lucide-react";

export default function CategorySection({
  subcategories,
  initialProducts,
}: {
  subcategories: ISubcategory[];
  initialProducts: IProduct[];
}) {
  const [selectedSubcat, setSelectedSubcat] = useState<"All" | ISubcategory>(
    "All"
  );
  const [products, setProducts] = useState<IProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAndSetProducts = async () => {
      setIsLoading(true);
      try {
        const { data: products, error } = await supabase
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
          .eq("subcategory_id", (selectedSubcat as ISubcategory).id)
          .eq("status", "Listed")
          .eq("brand.status", "Active")
          .eq("category.status", "Active")
          .eq("product_tag.tag.status", "Active");

        if (error) throw error;
        setProducts(products);
      } catch (error: any) {
        toast("Error occurred", {
          description: `Error message: ${error.message}`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSubcat === "All") {
      setProducts(initialProducts);
    } else {
      fetchAndSetProducts();
    }
  }, [selectedSubcat]);

  return (
    <div className="flex flex-col space-y-2.5 mb-5">
      <div className="flex flex-wrap text-md md:text-xl space-x-2.5">
        <span
          className={`${
            selectedSubcat === "All" ? "bg-eerie-black" : "bg-chest-nut"
          } text-white rounded-4xl px-2.5 py-1 md:px-5 md:py-2.5 cursor-pointer`}
          onClick={() => {
            setSelectedSubcat("All");
          }}
        >
          All
        </span>
        {subcategories.map((subcat) => (
          <span
            key={subcat.id}
            className={`${
              selectedSubcat !== "All" && selectedSubcat.id === subcat.id
                ? "bg-eerie-black"
                : "bg-chest-nut"
            } text-white rounded-4xl px-2.5 py-1 md:px-5 md:py-2.5 cursor-pointer`}
            onClick={() => {
              setSelectedSubcat(subcat);
            }}
          >
            {subcat.name}
          </span>
        ))}
      </div>
      <div className="border-b border-eerie-black" />
      {isLoading ? (
        <div className="flex items-center justify-center w-full p-5">
          <Loader2 className="animate-spin w-5 h-5 md:w-8 md:h-8 text-black" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex items-center text-gray-500">No items found</div>
      )}
    </div>
  );
}
