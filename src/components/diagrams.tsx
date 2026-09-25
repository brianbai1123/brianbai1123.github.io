import type { DiagramId } from "@/content/types";

const captions: Record<DiagramId, string> = {
  whole: "原书按人要解决的问题分编：先打地基，再谈生存、择偶、亲属和群居。",
  levels: "近因解释这一次怎么发生。远因解释这种心理为什么会被留下来。",
  selection: "三条选择回答不同的「为什么会留下来」。后面各章会分别用到它们。",
  fallacy: "能解释来历，不等于今天应当如此，也不等于今天仍然有益。",
  survival: "警报偏向误报。漏掉一次真正的危险，往往没有下次。",
  women: "长期关系里被抬高的，是还能不能稳定付出、愿不愿意付出。",
  men: "相对权重不同。善良和智力仍在双方共同的高位。",
  strategies: "时间尺度一变，被看重的线索就换一套。换套不是推荐。",
  parent: "利益大部分重合，所以有照料。不完全重合，所以会有冲突。",
  kin: "重叠越多，同一笔高代价的帮助越容易被接受。",
  recip: "非亲之间要记得住账，发现白占便宜就停下，对方改了还可以恢复。",
  status: "靠恐惧的服从会散。靠钦佩的跟随可以被撤回，也可以长久。",
};

export function Diagram({ id }: { id: DiagramId }) {
  return (
    <figure className="my-8 border-y border-line bg-paper/80 py-5">
      <div className="px-1">{renderDiagram(id)}</div>
      <figcaption className="mt-4 text-sm leading-relaxed text-muted">{captions[id]}</figcaption>
    </figure>
  );
}

function renderDiagram(id: DiagramId) {
  switch (id) {
    case "whole":
      return (
        <ol className="space-y-3">
          {[
            ["1", "地基", "选择如何塑造心理机制，假设怎样被检验"],
            ["2", "生存", "食物、居所、危险和宁可误报的警报"],
            ["3", "择偶", "长期与短期的不同权重"],
            ["4", "亲属与群居", "抚育、亲缘、合作、攻击、冲突、地位"],
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
    case "levels":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-pine">近因</p>
            <p className="mt-1 text-sm leading-relaxed">激素、学习、规范、这一次的情境。</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-pine">远因</p>
            <p className="mt-1 text-sm leading-relaxed">这种心理在反复出现的问题里为什么会被留下。</p>
          </div>
        </div>
      );
    case "selection":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            ["自然选择", "有助于活下来并留下后代"],
            ["性选择", "有助于获得配偶"],
            ["亲缘选择", "帮助到重叠的基因"],
          ].map(([title, text]) => (
            <li key={title} className="border-l-2 border-pine pl-3">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      );
    case "fallacy":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-pine">可以说</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">这种反应可能来自旧问题，并且今天会失配。</p>
          </div>
          <div>
            <p className="font-semibold text-clay">不能说</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">所以应当如此，或者所以不该改变。</p>
          </div>
        </div>
      );
    case "survival":
      return (
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["食物", "甜、脂肪、盐；避开可能的毒物"],
            ["居所", "能看见，也有地方可躲"],
            ["警报", "宁可把塑料袋当成蛇"],
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
    case "women":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {[
            ["资源", "以后还付不付得起"],
            ["可靠", "付出会不会突然停"],
            ["善意", "愿不愿意用在家里"],
          ].map(([title, text]) => (
            <li key={title} className="border-l-2 border-pine pl-3">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      );
    case "men":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-pine">共同的高位</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">善良、智力、让人愿意长期相处的性格。</p>
          </div>
          <div>
            <p className="font-semibold text-pine">相对更靠前的线索</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">年龄与健康的线索，以及长期关系里的忠诚。</p>
          </div>
        </div>
      );
    case "strategies":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-serif text-xl text-pine">长期</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">多年的投入、合作和养育。承诺本身就是要被检验的线索。</p>
          </div>
          <div>
            <p className="font-serif text-xl text-pine">短期</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">低承诺下的另一套权重。研究它，不是推荐它。</p>
          </div>
        </div>
      );
    case "parent":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-pine">重合的部分</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">孩子活得好，父母的遗传利益也在。所以会有照料。</p>
          </div>
          <div>
            <p className="font-semibold text-clay">错开的部分</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">资源要分给其他孩子和父母自己的生活。所以会争。</p>
          </div>
        </div>
      );
    case "kin":
      return (
        <ol className="space-y-2">
          {[
            ["子女、全同胞", "重叠最多，高代价帮助最容易"],
            ["孙子女、半同胞", "重叠下降，同样的代价更挑剔"],
            ["更远的亲属", "低代价可以，高代价常常要另找理由"],
          ].map(([title, text]) => (
            <li key={title} className="grid grid-cols-[7.5rem_1fr] gap-3 text-sm">
              <span className="font-semibold text-pine">{title}</span>
              <span className="text-muted">{text}</span>
            </li>
          ))}
        </ol>
      );
    case "recip":
      return (
        <ol className="grid gap-3 sm:grid-cols-3">
          {[
            ["先合作", "给一次值得记住的帮助"],
            ["记下账", "识别对方，发现只拿不还"],
            ["可恢复", "停下之后，对方改了还可以继续"],
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
    case "status":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-clay">支配</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">别人因为难堪或代价而服从。压力一停，服从就散。</p>
          </div>
          <div>
            <p className="font-semibold text-pine">声望</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">别人因为能力和可靠而自愿跟随，也可以撤回。</p>
          </div>
        </div>
      );
    default: {
      const never: never = id;
      return never;
    }
  }
}
