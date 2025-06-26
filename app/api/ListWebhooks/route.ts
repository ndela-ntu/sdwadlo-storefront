import { NextResponse } from "next/server";

export async function GET() {
  const getSubs = async () => {
    const response = await fetch("https://payments.yoco.com/api/webhooks", {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.TEST_SECRET_KEY}` },
    });

    const data = await response.json();

    const subscriptions = data.subscriptions;
    return subscriptions;
  };

  try {
    const subscriptions1 = await getSubs();
    const existingWebhooks: any[] = subscriptions1.filter(
      (sub: { name: string }) => sub.name === "Await-Webhook"
    );

    if (existingWebhooks.length > 1) {
      for (let i = 1; i < existingWebhooks.length; i++) {
        const sub = existingWebhooks[i];
        try {
          const response = await fetch("https://sdwadlo.shop/api/DeleteWebhook", {
            method: "DELETE",
            body: JSON.stringify({
              id: sub.id,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to delete webhook with ID: ${sub.id}`);
          }
        } catch (error) {
          throw error;
        }
      }
    }

    const subscriptions2 = await getSubs();

    const hookExists =
      subscriptions2.find(
        (sub: { name: string }) => sub.name === "Await-Webhook"
      ) !== undefined;

    return NextResponse.json({ hookExists, subscriptions: subscriptions2 });
  } catch (error) {
    throw error;
  }
}
