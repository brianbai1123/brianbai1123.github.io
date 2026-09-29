import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "lxgw-wenkai-screen-web/lxgwwenkaiscreen/result.css";
import "./globals.css";

const sans = Noto_Sans_SC({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const serif = Noto_Serif_SC({
  weight: ["600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const numerals = Cormorant_Garamond({
  weight: ["500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-numerals",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "原则、思想、知与行",
    template: "%s · 原则、思想、知与行",
  },
  description:
    "六本书读下来反复出现的十二条原则。每条按五步讲清，并附上七个习惯、原则、进化心理学、孙子兵法、周易和历久里的佐证。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} ${serif.variable} ${numerals.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
