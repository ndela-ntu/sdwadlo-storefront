import IProduct from "@/models/product";
import ProductCard from "../product-card";

export default function CollectionSection({
  products,
}: {
  products: IProduct[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5 mb-5">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="flex items-center text-gray-500">No items found</div>
      )}
    </div>
  );
}
