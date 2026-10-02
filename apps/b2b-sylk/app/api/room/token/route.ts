import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { roomName, isOwner, userName } = await req.json();

  if (!roomName) {
    return NextResponse.json({ error: "roomName required" }, { status: 400 });
  }

  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "DAILY_API_KEY not configured" }, { status: 500 });
  }

  try {
    const res = await fetch("https://api.daily.co/v1/meeting-tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          is_owner: isOwner ?? false,
          user_name: userName ?? "",
          start_cloud_recording: false,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Daily.co token error:", res.status, err);
      return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ token: data.token });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
