import sendConfirmationEmail from "@/lib/send-confirmation";
import IProductVariant from "@/models/product-variant";
import { supabase } from "@/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.payload.status === "succeeded") {
      const metadata = body.payload.metadata;
      const itemsArray: { id: number; total: number; quantity: number }[] =
        metadata.items;

      const { data, error } = await supabase
        .from("checkout_detail")
        .insert({
          firstName: metadata.firstName,
          lastName: metadata.lastName,
          email: metadata.email,
          phoneNumber: metadata.phoneNumber,
          streetAddress: metadata.streetAddress,
          town: metadata.town,
          postalCode: metadata.postalCode,
          province: metadata.province,
          items: metadata.items,
          total: metadata.total,
          status: "PENDING",
        })
        .select("id");

      if (error) {
        throw new Error(error.message);
      }

      let orderedVariants: (IProductVariant & { quantity: number })[] = [];

      for (const item of itemsArray) {
        const { data: variant, error } = await supabase
          .from("product_variant")
          .select(`*, product(*), size(*), color(*)`)
          .eq("id", item.id)
          .single();

        if (error) {
          throw new Error(`Item with id: ${item.id} not found`);
        }

        orderedVariants.push({...variant, quantity: item.quantity});

        const quantity = variant.quantity > 0 ? variant.quantity - item.quantity : 0;

        await supabase.from('product_variant').update({quantity}).eq("id", item.id);

        await sendConfirmationEmail(metadata.email, orderedVariants, metadata.total);
      }
      return NextResponse.json({
        status: "success",
        message: "Payment processed and checkout details submitted",
      });
    }
    return NextResponse.json(
        { status: "ignored", message: "Event ignored" },
        { status: 400 }
      );
  } catch (error) {
    throw error;
  }
}
