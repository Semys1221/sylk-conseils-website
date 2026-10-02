import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      isDark: boolean;
      channelId?: string;
    };
    const { isDark } = body;
    const channel = body.channelId ?? process.env.NEXT_PUBLIC_PUSHER_CHANNEL_ID ?? "sylk-conseils";

    if (!process.env.PUSHER_SECRET || process.env.PUSHER_SECRET === "not-set") {
      return NextResponse.json({ ok: true, note: "pusher_not_configured" });
    }

    const { getPusher } = await import("@/lib/pusher");
    const pusher = getPusher();
    await pusher.trigger(channel, "theme-toggle", { isDark });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("theme-toggle error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
