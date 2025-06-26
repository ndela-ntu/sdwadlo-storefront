import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const response = await fetch(
      `https://payments.yoco.com/api/webhooks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.LIVE_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json({ message: data.message });
  } catch (error) {
    throw error;
  }
}
