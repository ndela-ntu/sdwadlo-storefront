"use client";

import { useEffect, useState } from "react";
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

export default function CheckoutDetails() {
  const [total, setTotal] = useState(0);
  const { itemTotals } = useItemTotals();

  useEffect(() => {
    setTotal(itemTotals.reduce((a, v) => a + v.total, 0));
  }, [itemTotals]);

  return (
    <form className="flex flex-col w-full md:w-[30%] space-y-2.5 p-2.5">
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
            <Input name="firstName" />
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="lastName">
              Last Name
            </label>
            <Input name="lastName" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="email">
              Email
            </label>
            <Input name="email" />
          </div>
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm md:text-base" htmlFor="phoneNumber">
              Phone Number
            </label>
            <Input name="phoneNumber" type="tel" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full space-y-1.5 mt-1.5">
        <h3 className="text-sm md:text-base font-semibold">Shipping Details</h3>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="streetAddress">
            Street Address
          </label>
          <Input name="streetAddress" />
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="town">
            Town/City
          </label>
          <Input name="town" />
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="province">
            Province
          </label>
          <Select name="province">
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
        </div>
        <div className="flex flex-col space-y-1 w-full">
          <label className="text-sm md:text-base" htmlFor="postalCode">
            Postal Code
          </label>
          <Input name="postalCode" />
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Total</span>
          <span>R{total}</span>
        </div>
        <div className="w-full my-2">
          <button
            type="submit"
            className="bg-chest-nut text-white px-2.5 py-2 rounded-lg w-full"
          >
            Complete Checkout
          </button>
        </div>
      </div>
    </form>
  );
}
