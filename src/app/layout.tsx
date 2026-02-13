import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free PDF tools",
  description:
    "All in one 100% free PDF tools. Draw, edit, split, merge, rearrange, and convert, all in your browser, no files ever leave your device.",
  keywords: [
    "pdf",
    "editor",
    "draw",
    "split",
    "merge",
    "arrange",
    "convert",
    "free",
    "pdf tools",
    "100% free",
    "no upload",
    "no files ever leave your device",
    "100% client-side",
    "no server",
  ],
  openGraph: {
    title: "Free PDF tools",
    description:
      "All in one 100% free PDF tools. Draw, edit, split, merge, rearrange, and convert, all in your browser, no files ever leave your device.",
    images: [
      {
        url: "https://free-pdf-tools.vercel.app/og.png",
        width: 1200,
        height: 630,
        alt: "Free PDF tools",
      },
    ],
  },
  alternates: {
    canonical: "https://free-pdf-tools.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF tools",
    description:
      "All in one 100% free PDF tools. Draw, edit, split, merge, rearrange, and convert, all in your browser, no files ever leave your device.",
    images: ["https://free-pdf-tools.vercel.app/og.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    shortcut: "/favicon.ico",
  },
  authors: [{ name: "Niraj Pradhan", url: "https://github.com/nirajpdn" }],
  creator: "Niraj Pradhan",
  publisher: "Niraj Pradhan",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
