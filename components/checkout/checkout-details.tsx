"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useItemTotals } from "@/context/ItemTotalsContext";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import setOrAppendFormData from "@/lib/set-form-data";
import { CheckoutState, saveCheckoutDetails } from "@/app/checkout-actions";
import Link from "next/link";

export default function CheckoutDetails() {
  const initialState: CheckoutState = {
    message: null,
    errors: {},
  };
  const [state, formAction, pending] = useActionState(
    saveCheckoutDetails,
    initialState
  );

  const [total, setTotal] = useState(0);
  const { itemTotals } = useItemTotals();
  const { cart } = useCart();
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [loadingShippingCost, setLoadingShippingCose] =
    useState<boolean>(false);
  const [freeShipmentAmount, setFreeShipmentAmount] = useState<number>(0);

  // Form state controllers
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [town, setTown] = useState("");
  const [province, setProvince] = useState<string | undefined>(undefined);
  const [postalCode, setPostalCode] = useState("");

  const handleOnProvinceChange = async (value: string) => {
    try {
      setLoadingShippingCose(true);
      setProvince(value);

      const { data, error } = await supabase
        .from("shipping_by_province")
        .select("*")
        .eq("province", value)
        .single();

      if (error) throw error;

      setShippingCost(data.cost);
    } catch (error: any) {
      toast("Error", { description: `An error occurred: ${error.message}` });
    } finally {
      setLoadingShippingCose(false);
    }
  };

  useEffect(() => {
    const fetchFreeShipmentAmount = async () => {
      try {
        const { data, error } = await supabase
          .from("shipping_setting")
          .select("*")
          .eq("id", 1)
          .single();

        if (error) throw error;

        setFreeShipmentAmount(data.free_shipment_amount);
      } catch (error: any) {
        toast("Error", { description: `An error occurred: ${error.message}` });
      }
    };

    fetchFreeShipmentAmount();
  }, []);

  useEffect(() => {
    const subtotal = itemTotals.reduce((a, v) => a + v.total, 0);
    if (subtotal >= freeShipmentAmount) {
      setTotal(subtotal);
      setShippingCost(0);
    } else {
      setTotal(subtotal + shippingCost);
    }
  }, [itemTotals, shippingCost]);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-2.5 py-10">
        <span>Looks like your cart is empty!</span>
        <Link
          href="/products"
          className="flex items-center bg-chest-nut text-white p-2.5 rounded-lg"
        >
          <span>Continue Shopping</span>
          <span>
            <ArrowRight />
          </span>
        </Link>
      </div>
    );
  }

  return (
    <form
      action={(formData) => {
        let items = itemTotals.map((itemTotal) => {
          const cartItem = cart.find(
            (entry) => entry.variant.id === itemTotal.id
          );

          if (itemTotal.id === cartItem!.variant.id) {
            return {
              id: itemTotal.id,
              total: itemTotal.total,
              quantity: itemTotal.total / cartItem!.product.price,
            };
          }

          return { id: itemTotal.id, total: itemTotal.total, quantity: 1 };
        });

        setOrAppendFormData(formData, {
          key: "items",
          value: JSON.stringify(items),
        });
        setOrAppendFormData(formData, {
          key: "total",
          value: total.toString(),
        });

        formData.forEach((value, key) => {
          console.log(key, value);
        });

        formAction(formData);
      }}
      className="flex flex-col w-full md:w-[30%] space-y-2.5 p-2.5"
    >
      <h3 className="text-lg md:text-xl font-semibold underline">
        Checkout Details
      </h3>
      <div className="flex flex-col w-full space-y-1.5">
        <h3 className="text-sm md:text-base font-semibold">Personal Details</h3>
        <div className="flex items-center space-x-2 w-full">
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="firstName">
              First Name
            </label>
            <Input
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="lastName">
              Last Name
            </label>
            <Input
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastName &&
                state.errors.lastName.map((error: string, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="email">
              Email
            </label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="phoneNumber">
              Phone Number
            </label>
            <Input
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phoneNumber &&
                state.errors.phoneNumber.map((error: string, i) => (
                  <p key={i} className="text-sm text-red-500">
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full space-y-1.5 mt-1.5">
        <h3 className="text-sm md:text-base font-semibold">Shipping Details</h3>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="streetAddress">
            Street Address
          </label>
          <Input
            name="streetAddress"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.streetAddress &&
              state.errors.streetAddress.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="town">
            Town/City
          </label>
          <Input
            name="town"
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.town &&
              state.errors.town.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="province">
            Province
          </label>
          <Select
            name="province"
            value={province}
            onValueChange={handleOnProvinceChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Provinces</SelectLabel>
                {[
                  "Eastern Cape",
                  "Free State",
                  "Gauteng",
                  "KwaZulu-Natal",
                  "Limpopo",
                  "Mpumalanga",
                  "Northern Cape",
                  "North West",
                  "Western Cape",
                ].map((province, i) => (
                  <SelectItem value={province} key={i}>
                    {province}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.province &&
              state.errors.province.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="postalCode">
            Postal Code
          </label>
          <Input
            name="postalCode"
            type="number"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <div id="name-error" aria-live="polite" aria-atomic="true">
            {state.errors?.postalCode &&
              state.errors.postalCode.map((error: string, i) => (
                <p key={i} className="text-sm text-red-500">
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          {loadingShippingCost ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span>
              {total >= freeShipmentAmount ? "Free" : `R${shippingCost}`}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <span>R{total}</span>
        </div>
        <div className="w-full my-2">
          <button
            type="submit"
            disabled={pending}
            className="flex items-center justify-center bg-chest-nut text-white px-2.5 py-2 rounded-lg w-full"
          >
            {pending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Complete Checkout"
            )}
          </button>
        </div>
        {state?.message && (
          <div className="my-2 text-red-500 text-sm">{state.message}</div>
        )}
      </div>
    </form>
  );
}
