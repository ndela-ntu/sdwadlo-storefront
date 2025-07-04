import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, metadata } = await req.json();

    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LIVE_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        metadata,
        cancelUrl: "https://sdwadlo.shop/checkout",
        successUrl: "https://sdwadlo.shop/checkout/success",
        failureUrl: "https://sdwadlo.shop/checkout/failure",
      }),
    });

    const data = await response.json();

    const redirectUrl = data.redirectUrl;
    return NextResponse.json({ redirectUrl });
  } catch (error) {
    throw error;
  }
}
