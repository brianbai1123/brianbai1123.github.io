import type { DiagramId } from "@/content/types";

const captions: Record<DiagramId, string> = {
  whole: "原书的顺序：先看原则从哪来，再用于自己的生活，然后才是一群人一起做事。",
  loop: "疼只是信号。中间若没有反省，人会重复，或者只会躲。",
  orders: "第一眼的舒服，常常和后面的结果是反的。",
  machine: "上面的你负责看设计，下面的你负责做事。两个角色搅在一起，就没法改。",
  five: "五步按这个顺序走。目标和问题、诊断和动手，不要挤在同一次情绪里。",
  barriers: "自我把反对听成攻击。盲点让你根本看不见那一块。",
  triangle: "再找一个做成过、又肯反对你的人。人数本身不会产生真相。",
  brains: "压力一大，自动的那一层会抢走方向盘。决定要提前移出那个场面。",
  ev: "不只问最可能怎样，还要问：如果错了，有多贵。",
  culture: "三样少一样，另外两样就会变味。",
  weight: "分量针对这一件事：做成过，并且讲得出因果。",
  who: "先有目标和角色，再看人配不配。不要先把关系安排舒服。",
  gov: "原则要留在工具里，并且在负责人看错时仍能被叫停。",
};

export function Diagram({ id }: { id: DiagramId }) {
  return (
    <figure className="my-8 border-y border-line bg-paper/80 py-5">
      <div className="px-1">{renderDiagram(id)}</div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">
        {captions[id]}
      </figcaption>
    </figure>
  );
}

function renderDiagram(id: DiagramId) {
  switch (id) {
    case "whole":
      return (
        <ol className="space-y-3">
          {[
            ["1", "从哪里来", "原则是被打疼、再反省之后写下来的"],
            ["2", "生活原则", "现实、五步、开放、差异、决定"],
            ["3", "工作原则", "文化、可信度、对人、机器"],
            ["4", "写成自己的", "拿去试，失效了就改"],
          ].map(([n, title, text]) => (
            <li key={n} className="grid grid-cols-[2rem_1fr] gap-3">
              <span className="font-serif text-lg text-clay">{n}</span>
              <span>
                <span className="font-semibold text-ink">{title}</span>
                <span className="mt-0.5 block text-sm text-muted">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      );
    case "loop":
      return (
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["痛苦", "结果打到你身上"],
            ["反省", "哪个看法错了，哪一处设计要改"],
            ["进步", "写成下一次用得上的做法"],
          ].map(([title, text], index) => (
            <li key={title}>
              <p className="font-serif text-lg text-pine">
                {index + 1}. {title}
              </p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      );
    case "orders":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["第一眼", "现在很轻松，或现在很费劲"],
            ["第二步", "明天的状态、别人的信任"],
            ["第三步", "这件事还会不会再来"],
          ].map(([title, text]) => (
            <div key={title} className="border-l-2 border-pine pl-3">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      );
    case "machine":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-pine">上面的你 · 设计者</p>
            <p className="mt-1 text-sm leading-relaxed">看输入、流程和输出，决定改哪一个零件。</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-pine">里面的你 · 执行者</p>
            <p className="mt-1 text-sm leading-relaxed">按设计做事，不在做事的同时替自己辩护。</p>
          </div>
        </div>
      );
    case "five":
      return (
        <ol className="space-y-2">
          {["明确目标", "发现并不容忍问题", "诊断到根上", "把方案设计成能演的电影", "推进到做完"].map(
            (step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] gap-2 text-sm">
                <span className="font-serif text-lg text-clay">{index + 1}</span>
                <span className="self-center">{step}</span>
              </li>
            ),
          )}
        </ol>
      );
    case "barriers":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-clay">自我</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">看法被挑战时，人开始保卫自己，不再核对事实。</p>
          </div>
          <div>
            <p className="font-semibold text-clay">盲点</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">有一块你结构性看不见。不靠别人指出，它会留在原处。</p>
          </div>
        </div>
      );
    case "triangle":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            ["你的看法", "先说清推理"],
            ["对方的看法", "复述到对方认可"],
            ["可信的第三者", "做成过，并且肯反对"],
          ].map(([title, text]) => (
            <li key={title} className="border-l-2 border-pine pl-3">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      );
    case "brains":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-serif text-xl text-pine">自动的一层</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">快，保护面子，压力一大就抢方向盘。</p>
          </div>
          <div>
            <p className="font-serif text-xl text-pine">能想步骤的一层</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">慢，负责权衡。要在被抢走之前把决定写好。</p>
          </div>
        </div>
      );
    case "ev":
      return (
        <div className="grid grid-cols-2 gap-px bg-line text-sm">
          <div className="bg-paper px-3 py-2 font-semibold">看什么</div>
          <div className="bg-paper px-3 py-2 font-semibold">不只要看什么</div>
          <div className="bg-pine-soft px-3 py-3 leading-relaxed text-pine">
            几种结果各自的可能性，以及错了以后有多贵。
          </div>
          <div className="bg-paper px-3 py-3 leading-relaxed">只看最像会发生的那一个，然后用感觉拍板。</div>
        </div>
      );
    case "culture":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            ["极度求真", "把看法说准"],
            ["极度透明", "让相关的人看见依据"],
            ["可信度加权", "听完以后知道听谁"],
          ].map(([title, text]) => (
            <li key={title} className="border-l-2 border-pine pl-3">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      );
    case "weight":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-pine">加重</p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed">
              <li>这类事反复做成过</li>
              <li>讲得出成与败的因果</li>
              <li>肯不同意你</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-clay">不自动加重</p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed">
              <li>职位和辈分</li>
              <li>声音和关系</li>
              <li>和你结论相同的人数</li>
            </ul>
          </div>
        </div>
      );
    case "who":
      return (
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["目标", "要产出什么"],
            ["角色", "这一步需要什么"],
            ["人", "价值观、能力、技能配不配"],
          ].map(([title, text], index) => (
            <li key={title}>
              <p className="font-serif text-lg text-pine">
                {index + 1}. {title}
              </p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      );
    case "gov":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-pine">工具</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">问题清单、角色说明、做决定前的必问题。用来减少看心情。</p>
          </div>
          <div>
            <p className="font-semibold text-pine">治理</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">任何人，包括负责人，看错时都能被叫停和复查。</p>
          </div>
        </div>
      );
    default: {
      const never: never = id;
      return never;
    }
  }
}
