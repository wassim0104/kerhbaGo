import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "kerhbaGo | Premium Car Rental in Tunisia",
  description: "Location de voiture premium en Tunisie avec IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark h-full">
      <body
        className={`${syne.variable} ${dmSans.variable} font-sans antialiased bg-[#0D0D0D] text-[#F4F4F2] min-h-full flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
