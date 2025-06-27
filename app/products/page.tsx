import ProductPage from "@/components/products/product-page";

export const dynamic = 'force-dynamic';

export default async function Page() {
  return <div className="px-2.5">
    <ProductPage />
  </div>;
}
