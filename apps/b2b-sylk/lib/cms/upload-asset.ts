import { put } from "@vercel/blob";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function extForMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/avif") return "avif";
  if (mime === "video/mp4") return "mp4";
  if (mime === "video/webm") return "webm";
  if (mime === "video/quicktime") return "mov";
  return "bin";
}

export async function uploadCmsAsset(file: File, slug: string): Promise<{ url: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  const mime = file.type || "application/octet-stream";
  const isImage = IMAGE_TYPES.has(mime);
  const isVideo = VIDEO_TYPES.has(mime);

  if (!isImage && !isVideo) {
    throw new Error("Type de fichier non autorisé (images JPEG/PNG/WebP/GIF/AVIF ou vidéo MP4/WebM)");
  }

  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    throw new Error(
      isVideo
        ? "Vidéo trop volumineuse (max 100 Mo)"
        : "Image trop volumineuse (max 10 Mo)",
    );
  }

  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 48) || "asset";
  const pathname = `cms/assets/${safeSlug}-${Date.now()}.${extForMime(mime)}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: mime,
  });

  return { url: blob.url };
}
