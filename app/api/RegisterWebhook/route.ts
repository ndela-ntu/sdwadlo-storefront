import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://payments.yoco.com/api/webhooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`,
      },
      body: JSON.stringify({
        name: "Await-Webhook",
        url: process.env.WEBHOOK_URL,
      }),
    });

    const data = await response.json();
    console.log(data);

    return NextResponse.json({mode: data.mode});
  } catch (error) {
    throw error;
  }
}
