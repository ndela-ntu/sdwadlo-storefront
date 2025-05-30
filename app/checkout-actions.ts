"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const southAfricanProvinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

const provinceSchema = z.enum(southAfricanProvinces, {
  errorMap: (issue, ctx) => {
    return { message: "Please select a valid province" };
  },
});

const ItemSchema = z.object({
  id: z.number(),
  total: z.number().positive(),
  quantity: z.number().int().positive(),
});

const CheckoutSchema = z.object({
  firstName: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().refine(
    (val) => {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
      return phoneRegex.test(val);
    },
    { message: "Invalid phone number" }
  ),
  streetAddress: z.string().min(5, "Address must be at least 5 characters"),
  town: z.string().min(2, "City must be at least 2 characters"),
  province: provinceSchema,
  postalCode: z.number().min(2, "Zip code must be at least 2 number"),
  items: z.array(ItemSchema).nonempty("At least one item is required"),
  total: z.number().positive("Total must be a positive number"),
});

export type CheckoutState = {
  errors: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    phoneNumber?: string[];
    streetAddress?: string[];
    town?: string[];
    province?: string[];
    postalCode?: string[];
  };
  message?: string | null;
};

export async function saveCheckoutDetails(
  prevState: CheckoutState,
  formData: FormData
) {
  const validatedFields = CheckoutSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    streetAddress: formData.get("streetAddress"),
    town: formData.get("town"),
    province: formData.get("province"),
    postalCode: Number(formData.get("postalCode")),
    items: JSON.parse(formData.get("items") as string),
    total: parseFloat(formData.get("total") as string),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return <CheckoutState>{
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create checkout.",
    };
  }

  let redirectUrl = "/checkout/failure";

  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      streetAddress,
      town,
      province,
      postalCode,
      items,
      total,
    } = validatedFields.data;

    const metadata = {
      firstName,
      lastName,
      email,
      phoneNumber,
      streetAddress,
      town,
      postalCode,
      province,
      items,
      total,
    };

    // await fetch(
    //   "https://sdwadlo.vercel.app/api/DeleteWebhook",
    //   {
    //     method: "DELETE",
    //     body: JSON.stringify({
    //       id: "sub_QLOBGy56Q1VubYbC6XwIjAxb",
    //     }),
    //   }
    // );

    const result = await checkWHExists();
    if (!result.hookExists) {
      const mode = await registerWebhook();

      if (mode === "test" || mode === "live") {
        const response = await handleCheckout(metadata);
        redirectUrl = response.redirectUrl;
      } else {
        throw new Error("Unable to register webhook");
      }
    } else {
      const response = await handleCheckout(metadata);
      redirectUrl = response.redirectUrl;
    }
    console.log(result, redirectUrl);
  } catch (error: any) {
    return <CheckoutState>{
      message: "An unexpected error occurred",
      errors: [],
    };
  }

  redirect(redirectUrl);
}

const BASE_URL = "https://sdwadlo.vercel.app";
const LOCAL_URL = "https://localhost:3000";

const checkWHExists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/ListWebhooks`, {
      method: "GET",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

const registerWebhook = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/RegisterWebhook`, {
      method: "POST",
    });

    const data = await response.json();

    return data.mode;
  } catch (error) {
    throw error;
  }
};

const handleCheckout = async (metadata: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  town: string;
  postalCode: number;
  province: string;
  items: { id: number; total: number; quantity: number }[];
  total: number;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/api/CreateCheckout`, {
      method: "POST",
      body: JSON.stringify({
        amount: metadata.total * 100,
        currency: "ZAR",
        metadata,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
