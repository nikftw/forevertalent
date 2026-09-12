import type { Metadata } from "next";
import { Cinzel, Open_Sans } from "next/font/google";
import "./globals.css";

const sans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WoW Forever Talent Calculator",
  description:
    "Plan World of Warcraft Forever talent builds across all nine classes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
