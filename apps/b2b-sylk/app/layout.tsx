import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SYLK Conseils",
  description:
    "Cabinet d'expertise comptable et de conseil stratégique. Nous accompagnons les dirigeants et entrepreneurs dans la gestion, la fiscalité et le développement de leur entreprise.",
  keywords: [
    "expertise comptable",
    "conseil stratégique",
    "gestion financière",
    "fiscalité",
    "dirigeants",
    "entrepreneurs",
    "SYLK Conseils",
  ],
  authors: [{ name: "SYLK Conseils" }],
  creator: "SYLK Conseils",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://sylkconseils.com",
    title: "SYLK Conseils",
    description:
      "Cabinet d'expertise comptable et de conseil stratégique accompagnant les dirigeants d'entreprise.",
    siteName: "SYLK Conseils",
  },
  twitter: {
    card: "summary_large_image",
    title: "SYLK Conseils",
    description: "Cabinet d'expertise comptable et de conseil stratégique.",
  },
  icons: {
    icon: "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png",
    shortcut:
      "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png",
    apple:
      "https://grzs6rqzvzupoxv9.public.blob.vercel-storage.com/stephane/croped%20circle-stepahen.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`font-sans ${geist.variable}`}>
      <body className="antialiased font-sans flex flex-col min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
