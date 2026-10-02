import { NextRequest, NextResponse } from "next/server";
import { getPusher } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      fieldKey: string;
      value: string;
      source: string;
      channelId?: string;
    };
    const { fieldKey, value, source, channelId } = body;
    const channel = channelId ?? process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";

    if (!process.env.PUSHER_SECRET || process.env.PUSHER_SECRET === "not-set") {
      return NextResponse.json({ ok: true, note: "pusher_not_configured" });
    }

    const pusher = getPusher();
    await pusher.trigger(channel, "field-update", { fieldKey, value, source });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("sync-field error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
