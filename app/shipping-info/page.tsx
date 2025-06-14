export default function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-4">Shipping Information</h1>

      <p className="text-base mb-4">
        You will receive an automated confirmation email after you place your
        order.
      </p>

      <p className="text-base mb-4">
        Please allow <strong>4–5 business days</strong> for order delivery. Once
        an order has been placed, it cannot be modified or cancelled.
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">
        How To Track Your Order
      </h2>
      <p className="text-base mb-4">
        Local (South African) orders are shipped using reliable couriers such as{" "}
        <strong>The Courier Guy.</strong>
      </p>

      <p className="text-base mb-4">
        Shipping delays may occur during sale periods, weekends, and public
        holidays.
      </p>

      <p className="text-base mb-4">
        Please note, we do not ship on weekends and public holidays. We are also
        unable to deliver to P.O. Box addresses — a valid street address is
        required for all deliveries.
      </p>

      <p className="text-base mb-4">
        <em>
          SDWADLO is not responsible for items lost, damaged, or stolen in
          transit. Please note that parcels are not shipped as insured.
        </em>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Shipping Rates</h2>
      <p className="text-base mb-2">
        • <strong>R50-R100</strong> flat rate for orders under R500
      </p>
      <p className="text-base mb-4">
        • <strong>Free shipping</strong> for orders over R500
      </p>
    </div>
  );
}
