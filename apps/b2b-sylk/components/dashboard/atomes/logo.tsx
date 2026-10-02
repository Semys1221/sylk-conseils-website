import { cn } from "@/lib/utils";

export function Logo({
  showText = true,
  size = "sm",
  className,
}: {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const imgSize = size === "lg" ? "w-10 h-10" : size === "md" ? "w-8 h-8" : "w-7 h-7";
  const textSize = size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-sm";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src="https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png"
        alt="SYLK Conseils"
        className={cn(
          imgSize,
          "rounded-full ring-1 ring-white/20 group-hover:ring-white/40 transition-all"
        )}
      />
      {showText && (
        <span
          className={cn(
            textSize,
            "font-serif font-normal tracking-widest text-white/90 group-hover:text-white transition-colors"
          )}
        >
          SYLK Conseils
        </span>
      )}
    </div>
  );
}
