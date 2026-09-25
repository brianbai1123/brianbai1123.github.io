import type { Metadata } from "next";
import { Hall } from "@/components/hall";

export const metadata: Metadata = {
  title: "藏书室",
  description: "七个习惯、原则、进化心理学、孙子兵法、周易和历久，放在同一间藏书室里。",
};

export default function HomePage() {
  return <Hall />;
}
