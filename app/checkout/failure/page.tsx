import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col">
      <span>Failed to submit transaction. Please try again</span>
      <Link
        className="p-2.5 bg-chest-nut rounded-lg text-white"
        href="/checkout"
      >
        Checkout
      </Link>
    </div>
  );
}
