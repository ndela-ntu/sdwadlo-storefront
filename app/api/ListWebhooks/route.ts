import { NextResponse } from "next/server";

// Helper: Fetch Yoco webhook subscriptions
const fetchSubscriptions = async () => {
  const response = await fetch("https://payments.yoco.com/api/webhooks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.LIVE_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Yoco API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.subscriptions || []; // Fallback to empty array
};

// Helper: Delete a webhook by ID
const deleteWebhook = async (id: string) => {
  const response = await fetch("https://sdwadlo.shop/api/DeleteWebhook", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete webhook (ID: ${id})`);
  }
};

export async function GET() {
  try {
    // 1. Fetch current subscriptions
    const subscriptions = await fetchSubscriptions();
    console.log("Current subscriptions:", subscriptions);

    // 2. Filter duplicates of "Await-Webhook"
    const duplicateWebhooks = subscriptions.filter(
      (sub: { name: string }) => sub.name === "Await-Webhook"
    );

    // 3. Delete extras (keep only the first one)
    if (duplicateWebhooks.length > 1) {
      console.log(
        `Found ${duplicateWebhooks.length} duplicates. Deleting extras...`
      );

      const deletions = duplicateWebhooks.slice(1).map((sub: { id: string }) =>
        deleteWebhook(sub.id).catch((error) => {
          console.error(`Error deleting webhook ${sub.id}:`, error);
          return { success: false, id: sub.id, error };
        })
      );

      await Promise.all(deletions);
    }

    // 4. Re-fetch subscriptions to confirm
    const updatedSubscriptions = await fetchSubscriptions();
    const hookExists = updatedSubscriptions.some(
      (sub: { name: string }) => sub.name === "Await-Webhook"
    );

    return NextResponse.json({
      hookExists,
      subscriptions: updatedSubscriptions,
    });
  } catch (error) {
    console.error("Error in webhook check:", error);
    return NextResponse.json(
      { error: "Failed to verify webhooks" },
      { status: 500 }
    );
  }
}
