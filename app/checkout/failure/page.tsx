import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-10 space-y-2.5">
      <span>Failed to complete transaction. Please try again.</span>
      <Link
        className="flex items-center p-2.5 bg-chest-nut rounded-lg text-white"
        href="/checkout"
      >
        <span>Checkout</span>
        <span>
          <ArrowRight className="h-6 w-6" />
        </span>
      </Link>
    </div>
  );
}
