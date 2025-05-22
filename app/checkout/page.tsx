import CheckoutDetails from "@/components/checkout/checkout-details";
import OrderSummary from "@/components/checkout/order-summary";

export default function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <OrderSummary />
      <CheckoutDetails />
    </div>
  );
}
