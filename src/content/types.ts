export type DiagramId =
  | "whole"
  | "levels"
  | "selection"
  | "fallacy"
  | "survival"
  | "women"
  | "men"
  | "strategies"
  | "parent"
  | "kin"
  | "recip"
  | "status";

export type EssenceBlock = {
  heading: string;
  paragraphs: string[];
  points?: string[];
  diagram?: DiagramId;
  table?: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
};

export type StripKind = "mating" | "family" | "group";

export type Chapter = {
  slug: string;
  group: "读之前" | "地基" | "生存" | "择偶" | "养育与亲属" | "群居" | "收束";
  navLabel: string;
  eyebrow: string;
  title: string;
  bookRef: string;
  lead: string;
  strip?: { kind: StripKind; index: number };
  place?: string;
  essenceIntro: string;
  essence: EssenceBlock[];
  plain: {
    understand: string;
    core: string;
    logic: string[];
    scenes: { title: string; body: string }[];
    checks: { question: string; answer: string }[];
  };
  remember: string;
  glossary?: { term: string; def: string }[];
};

export const GROUP_ORDER = [
  "读之前",
  "地基",
  "生存",
  "择偶",
  "养育与亲属",
  "群居",
  "收束",
] as const;

export const STRIPS: Record<StripKind, { band: string; names: readonly string[] }> = {
  mating: { band: "择偶", names: ["女性长期", "男性长期", "短期"] },
  family: { band: "亲属", names: ["抚育", "亲属"] },
  group: { band: "群居", names: ["合作", "攻击", "冲突", "地位"] },
};
