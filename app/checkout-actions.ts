import { redirect } from "next/navigation";
import { z } from "zod";

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
  province: z.string().min(2, "A province is required"),
  postalCode: z.string().min(2, "Zip code must be at least 2 characters"),
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
    postalCode: formData.get("postalCode"),
  });

  if (!validatedFields.success) {
    return <CheckoutState>{
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missed fields, failed to create checkout.",
    };
  }

  let redirectUrl = '/checkout/failure';

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

  }catch(error) {
    return <CheckoutState>{
      message: 'An unexpected error occurred',
      errors: [],
    }
  }
  
  redirect(redirectUrl);
}
