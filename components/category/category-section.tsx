"use client";

import IProduct from "@/models/product";
import ISubcategory from "@/models/subcategory";
import { useEffect, useState } from "react";

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

  useEffect(() => {}, [selectedSubcat]);

  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex flex-wrap text-md md:text-xl space-x-2.5">
        <span
          className={`${
            selectedSubcat === "All" ? "bg-eerie-black" : "bg-chest-nut"
          } text-white rounded-4xl px-2.5 py-1 md:px-5 md:py-2.5`}
          onClick={() => {
            setSelectedSubcat("All");
          }}
        >
          All
        </span>
        {subcategories.map((subcat) => (
          <span
            key={subcat.id}
            className="text-white bg-chest-nut rounded-4xl px-2.5 py-1 md:px-5 md:py-2.5"
            onClick={() => {
              setSelectedSubcat(subcat);
            }}
          >
            {subcat.name}
          </span>
        ))}
      </div>
      <div className="border-b border-eerie-black" />
    </div>
  );
}
