import { NextRequest, NextResponse } from "next/server";
import { getPusher } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const { slideIndex } = await request.json();
    const channelId = process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";

    if (process.env.PUSHER_SECRET === "not-set" || !process.env.PUSHER_SECRET) {
      return NextResponse.json({ ok: true, note: "pusher_not_configured" });
    }

    const pusher = getPusher();
    await pusher.trigger(channelId, "slide-change", { slideIndex });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Slide change error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
