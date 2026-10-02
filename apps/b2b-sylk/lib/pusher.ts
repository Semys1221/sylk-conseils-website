import Pusher from "pusher";

let pusherInstance: Pusher | null = null;

export function getPusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID ?? "not-set",
      key: process.env.NEXT_PUBLIC_PUSHER_KEY ?? "not-set",
      secret: process.env.PUSHER_SECRET ?? "not-set",
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "eu",
      useTLS: true,
    });
  }
  return pusherInstance;
}
