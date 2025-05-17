"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import ProductCard from "@/components/product-card";
import IProduct from "@/models/product";
import { Loader2 } from "lucide-react";

const PAGE_SIZE = 8;

export default function ProductPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg("");

      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
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
          `,
          { count: "exact" }
        )
        .eq("status", "Listed")
        .eq("brand.status", "Active")
        .eq("category.status", "Active")
        .eq("product_tag.tag.status", "Active")
        .range(from, to);

      if (error) {
        setErrorMsg(error.message);
      } else {
        setProducts(data || []);
        setTotalPages(Math.ceil((count || 0) / PAGE_SIZE));
      }

      setLoading(false);
    };

    fetchProducts();
    if (topRef.current) {
      console.log("scrolling");
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  return (
    <div ref={topRef} className="pb-24 min-h-screen flex flex-col space-y-4">
      {loading && (
        <span className="flex items-center justify-center">
          <Loader2 className="animate-spin text-black" />
        </span>
      )}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Fixed Pagination */}
      <div className="sticky bottom-0 bg-white py-4 z-30 flex items-center justify-center space-x-2.5 text-sm md:text-base">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((p) => p - 1);
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => {
            setCurrentPage((p) => p + 1);
          }}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
