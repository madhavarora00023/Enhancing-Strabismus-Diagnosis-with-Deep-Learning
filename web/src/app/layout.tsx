import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible_Mono, Atkinson_Hyperlegible_Next, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const atkinsonMono = Atkinson_Hyperlegible_Mono({
  variable: "--font-atkinson-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://strabismus.madhavarora.com"),
  title: {
    default: "Strabismus — reading eye alignment from a photograph",
    template: "%s · Strabismus",
  },
  description:
    "How four neural networks learned to sort eye photographs into five kinds of strabismus, step by step, from data collection to results. Presented at AIMLA 2025.",
};

export const viewport: Viewport = {
  themeColor: "#0e1726",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${atkinson.variable} ${atkinsonMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
