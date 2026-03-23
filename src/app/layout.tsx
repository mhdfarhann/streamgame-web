import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamGame — Interactive Game Overlay untuk Livestream",
  description: "Game overlay interaktif untuk TikTok Live, YouTube, dan Twitch. Spin wheel, tebak kartu, dan lebih banyak lagi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}