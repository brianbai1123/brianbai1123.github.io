export type BookId = "7habit" | "ruiprincipal" | "ep" | "sunzi" | "zhouyi" | "lijiu";

export type DimensionId =
  | "cognition"
  | "character"
  | "relations"
  | "collaboration"
  | "action"
  | "risk"
  | "adversity"
  | "meaning";

export type Dimension = { id: DimensionId; name: string; question: string };

export type Link = { label: string; href: string };

export type Evidence = { book: BookId; links: Link[]; angle: string };

export type Principle = {
  n: number;
  dimension: DimensionId;
  title: string;
  understand: string;
  core: string;
  logic: string[];
  limits: string;
  plain: string;
  check: string;
  evidence: Evidence[];
};

export type Candidate = { title: string; links: (Link & { book: BookId })[] };

const ROOT = "https://brianbai1123.github.io";

const guide = (book: "7habit" | "ruiprincipal" | "ep", slug: string, label: string): Link => ({
  label,
  href: `${ROOT}/${book}/${slug ? `${slug}/` : ""}`,
});
const habit = (slug: string, label: string) => guide("7habit", slug, label);
const rui = (slug: string, label: string) => guide("ruiprincipal", slug, label);
const ep = (slug: string, label: string) => guide("ep", slug, label);
const sunzi = (id: number, label: string): Link => ({ label, href: `${ROOT}/sunzi/#chapter/${id}` });
const gua = (id: number, label: string): Link => ({
  label,
  href: `${ROOT}/zhouyi-reading-cards/#gua/${id}`,
});
const lijiu = (id: string, label: string): Link => ({ label, href: `${ROOT}/lijiu/#${id}` });

export const dimensions: Dimension[] = [
  { id: "cognition", name: "认知与判断", question: "怎样才算真的看清" },
  { id: "character", name: "品格与自我", question: "没人看着的时候，你是谁" },
  { id: "relations", name: "关系与他人", question: "两个人之间怎样长久" },
  { id: "collaboration", name: "协作与组织", question: "一群人怎样一起做成事" },
  { id: "action", name: "行动与时间", question: "力气和时间往哪里放" },
  { id: "risk", name: "风险与生存", question: "怎样才不出局" },
  { id: "adversity", name: "苦难与无常", question: "坏事来了之后怎么办" },
  { id: "meaning", name: "意义与限度", question: "什么时候够了" },
];

export const principles: Principle[] = [
  {
    n: 1,
    dimension: "cognition",
    title: "先看清事实，也让事实能纠正你",
    understand:
      "这条回答「我凭什么相信自己的判断」。人最常见的错不是不努力，而是在一张错的地图上努力。",
    core: "先看清事实再判断，并留一扇门让事实推翻你。",
    logic: [
      "做事的效果，取决于心里的地图和真实的地形对不对得上。",
      "所以动手前要先把事实算清。孙子说多算胜，而敌情只能从真正知情的人那里得来，不能靠猜，也不能靠类比。",
      "只看一次还不够。人最容易在自己最有把握的地方看错，达利欧的低谷就是这样来的。所以要主动去问做成过、又肯反对你的人。",
      "科学把这件事做成了规矩：一个说法必须写明，出现什么证据它就算错。",
    ],
    limits: "前提是信息拿得到。火已经着了的时候，只能凭不完整的信息先动，这时按第 10 条先分清可逆和不可逆。",
    plain:
      "动手前先看清到底发生了什么，别拿「我觉得」代替「我看见」。看完也别关门，找一个真懂又肯反对你的人问一问。被说中了就改，这不丢人。",
    check: "你很确定一件事的时候，说得出「出现什么情况，我就承认自己错了」吗？",
    evidence: [
      { book: "7habit", links: [habit("foundation", "由内而外")], angle: "经验：先检查自己用的是哪张地图" },
      {
        book: "ruiprincipal",
        links: [rui("reality", "拥抱现实"), rui("open-mind", "极度开放")],
        angle: "亲历：看错以后，用可信的人做三角定位",
      },
      { book: "ep", links: [ep("together", "收成一门科学")], angle: "科学方法：写出会被证据打脸的预测" },
      { book: "sunzi", links: [sunzi(1, "始计"), sunzi(13, "用间")], angle: "战略：多算胜；先知必取于人" },
      { book: "zhouyi", links: [gua(20, "观")], angle: "象：从只看热闹、从缝里窥看，到先省察自己的生活" },
      {
        book: "lijiu",
        links: [lijiu("know-what-you-dont-know", "知道自己不知道"), lijiu("listen-to-both-sides", "兼听则明")],
        angle: "古典格言：《论语·为政》、魏征答唐太宗",
      },
    ],
  },
  {
    n: 2,
    dimension: "character",
    title: "停一下，再选回应",
    understand:
      "事情一来，人常觉得只能爆发、委屈，或者说「没办法」。这条回答「坏事来了，我还剩什么」。",
    core: "刺激和回应之间有空隙，把力气放在自己能决定的部分。",
    logic: [
      "情绪来得快，这是有来历的。生存心理宁可误报，所以第一反应不一定适合眼前这件事。它是警报，不是命令，也可以重新设定。",
      "警报响过以后，人还有一段空隙可以选择。柯维讲这段空隙；爱比克泰德讲分清可控与不可控。",
      "孙子说「不可胜在己」，功夫要下在自己这边。他又说「主不可以怒而兴师」，愤怒不能当决策的依据。",
      "达利欧说，有害的情绪常常已经替人选完了，所以要把学习和决定分成两步。",
    ],
    limits:
      "可控和不可控常常是渐变的，把能影响三成的事说成「管不了」，就成了推卸。受到伤害的时候，「选回应」包括说出来、求助和离开，不是忍着。",
    plain:
      "生气或害怕的时候，先停三秒。这股劲是提醒，不是命令。问自己：这件事里，哪一步是我今天能做的？先做那一步，别人的那部分先放下。受了伤害就说出来，找人帮忙。",
    check: "同学当众笑你，你能分清哪些是你能决定的、哪些不是吗？",
    evidence: [
      { book: "7habit", links: [habit("habit-1", "积极主动")], angle: "经验：刺激和回应之间有空隙" },
      { book: "ep", links: [ep("survival", "活下来")], angle: "科学：情绪是宁可误报的古老警报，可以重新设定" },
      { book: "sunzi", links: [sunzi(4, "军形"), sunzi(12, "火攻")], angle: "战略：不可胜在己；不因愤怒开战" },
      { book: "ruiprincipal", links: [rui("decide", "做决定")], angle: "方法：先学习，再决定，别让情绪抢先" },
      { book: "zhouyi", links: [gua(41, "损"), gua(39, "蹇")], angle: "象：惩忿窒欲；反身修德，先改自己能改的" },
      { book: "lijiu", links: [lijiu("dichotomy-of-control", "分清可控与不可控")], angle: "古典：爱比克泰德《手册》第一章" },
    ],
  },
  {
    n: 3,
    dimension: "character",
    title: "信任靠品格慢慢存，不靠技巧",
    understand: "同样一句话，为什么有人说出来是真诚，有人说出来是套路？",
    core: "信任是慢慢存、一次就能取光的账户，存进去的是言行一致。",
    logic: [
      "信任低的时候，技巧会被当成套路。柯维因此把品德放在技巧前面，并把守信、理解、道歉看作存入情感账户的钱。",
      "信任值钱，是因为合作的人会记账，会分辨谁会回报。",
      "地位有两条路。靠别人心甘情愿给的声望，可以长久；但这种声望也可以被撤回。",
      "所以别人称你意见的重量，看的是你过去的记录，也就是原则里的「可信度加权」。",
    ],
    limits: "在一次性、匿名的场合，名声管不住人，所以不能只靠人品，还要有规则。",
    plain:
      "别人信不信你，不看你说得多漂亮，看你答应的事做到没有。守一次信，存一笔；失一次信，可能全取光。没人看见的时候也照样做，这笔账才存得住。",
    check: "你最信任的那个人，是因为他会说话，还是因为他说到做到？",
    evidence: [
      {
        book: "7habit",
        links: [habit("", "整张地图"), habit("habit-4", "双赢思维")],
        angle: "经验：品德先于技巧；情感账户",
      },
      {
        book: "ep",
        links: [ep("status", "地位"), ep("cooperate", "合作")],
        angle: "科学：声望可以被撤回；合作的人会记账",
      },
      { book: "ruiprincipal", links: [rui("weight", "可信度加权")], angle: "方法：意见按过去的记录称重" },
      { book: "zhouyi", links: [gua(61, "中孚"), gua(29, "坎")], angle: "象：言行可以核对；身处险境也不失信" },
      {
        book: "lijiu",
        links: [lijiu("integrity-alone", "慎独"), lijiu("reputation-compounds", "信誉复利")],
        angle: "古典：《中庸》；《论语·为政》",
      },
    ],
  },
  {
    n: 4,
    dimension: "relations",
    title: "先听懂，再说话",
    understand: "为什么道理准备好了，对方反而更生气？",
    core: "先把对方的意思说对，再讲你自己的。",
    logic: [
      "人要先被看见，才有空听道理。柯维的比喻是：先诊断，再开药。",
      "听也是为了求真。先复述对方，才能判断他的反对里有没有你漏掉的事实。所以倾听不只是礼貌，也是在收集信息。",
      "周易的咸卦说「以虚受人」：心里塞满成见，别人的话就进不来。但卦辞也说「利贞」，开放不等于没有边界。",
    ],
    limits: "面对故意操纵或极限施压的人，无条件地听会被当成软弱。",
    plain:
      "对方说完，先用一句话讲出他的意思和感受，问一句「我这样理解对吗」。对了，再说你的看法。听懂不等于同意。遇到故意耍你的人，听完可以拒绝。",
    check: "上一次争执，你能用对方会点头的话，说出他真正在意的是什么吗？",
    evidence: [
      { book: "7habit", links: [habit("habit-5", "知彼解己")], angle: "经验：诊断先于开药" },
      { book: "ruiprincipal", links: [rui("open-mind", "极度开放")], angle: "方法：先复述对方，再判断" },
      { book: "zhouyi", links: [gua(31, "咸")], angle: "象：以虚受人，但要守正" },
      {
        book: "lijiu",
        links: [lijiu("seek-first-to-understand", "先求理解")],
        angle: "古典：《论语·学而》「患不知人也」（这张卡也引了柯维，不重复计算）",
      },
    ],
  },
  {
    n: 5,
    dimension: "relations",
    title: "合作要双方都得益，也要能退出",
    understand: "愿意帮人，但不想一直帮一个从不回帮的人，这算不算小气？",
    core: "好的合作双方都得益。做不到就好聚好散，对方改了还能恢复。",
    logic: [
      "在长期关系里把对方赢下去，等于把以后的合作也一起赢没了。柯维把这叫作「双赢，或者不成交」。",
      "「不成交」这个选项必须有。非亲属之间的合作靠回报维持，有人只拿不还，合作者就得能退出，否则合作会被耗尽。",
      "进化心理学讲了一种常被讨论的策略：先合作；对方背叛就停；对方改了再恢复。重点是能退出、能原谅，不是报复升级。",
      "周易的比卦讲：加入一群人之前，先看它的核心可不可靠；「后夫凶」批评的是只在有利可图时才来的人。",
    ],
    limits: "先给点小好处再要大回报，是操纵的老套路。给予的人要同时懂得保护自己。",
    plain:
      "合作前先问：有没有一个结果，我们俩都真心想要？有，就一起做；没有，就客客气气分开。对方一直只拿不还，可以停下；他改了，可以再合作。停下不是报复。",
    check: "好聚好散和翻脸有什么不同？",
    evidence: [
      { book: "7habit", links: [habit("habit-4", "双赢思维")], angle: "经验：双赢或不成交" },
      { book: "ep", links: [ep("cooperate", "合作")], angle: "科学：能记账，能退出，能恢复" },
      { book: "zhouyi", links: [gua(8, "比")], angle: "象：先看核心可不可靠；后夫凶" },
      {
        book: "lijiu",
        links: [lijiu("reciprocity", "礼尚往来"), lijiu("give-more", "给予")],
        angle: "古典：《礼记·曲礼》；成功的给予者也会保护自己",
      },
    ],
  },
  {
    n: 6,
    dimension: "collaboration",
    title: "差异是原料，不是噪音",
    understand: "开会讨论完，最后定下来的还是嗓门最大那个人的方案，为什么？",
    core: "把不同看法当原料，做出谁单独都想不到的办法。",
    logic: [
      "每个人只看见事实的一部分。柯维说的「第三种办法」，就是同时用上你看见的和我看见的。",
      "人天生就不一样，有人擅长写方案，有人擅长挑毛病，这些差异要拿来分工。两个方案取平均，常常得到一个谁都不满意的中点。",
      "周易的睽卦讲「同而异」：看见共同点，也保留差异。分歧大的时候，先一起做成小事，慢慢建立信任。",
      "前提是信任够高、双方都想双赢，否则差异会变成互相防守。",
    ],
    limits: "原则性的是非不拿来「综合」。",
    plain:
      "意见不同的时候，别急着争谁对。先问对方：你看见了哪一块是我没看见的？把两块拼起来，找一个新办法。不是你赢、不是我赢，也不是各让一半。",
    check: "「一起想出新办法」和「各让一半」差在哪里？",
    evidence: [
      { book: "7habit", links: [habit("habit-6", "统合综效")], angle: "经验：第三种办法" },
      {
        book: "ruiprincipal",
        links: [rui("wired", "了解差异"), rui("weight", "可信度加权")],
        angle: "方法：按差异分工；不取平均",
      },
      { book: "zhouyi", links: [gua(38, "睽")], angle: "象：同而异；先做成小事" },
      {
        book: "lijiu",
        links: [lijiu("listen-to-both-sides", "兼听则明"), lijiu("choose-company", "选择同伴")],
        angle: "古典及失效条件：要听有独立信息的人；太相似的圈子会变成回音室",
      },
    ],
  },
  {
    n: 7,
    dimension: "collaboration",
    title: "改结构和条件，比责怪个人更管用",
    understand: "同样的错一再发生，是人不行，还是事情的安排不行？",
    core: "先改条件、角色和流程，再谈人的态度。",
    logic: [
      "孙子说「求之于势，不责于人」：会打仗的人不苛责每个士兵，而是先造好态势，再把合适的人放进去。",
      "达利欧说出了问题，要先分清原因：是设计错了，是人不适合这个角色，还是没照设计做。补救要写回流程，因为「以后注意」不算办法。",
      "进化心理学发现，攻击行为要看条件才会出现，条件和代价变了，发生的次数就会变。",
      "历久的古典出处也说：看激励，不看承诺；你会变成身边人的平均值。",
    ],
    limits: "激励太强，会挤掉人本来的兴趣。结构也不能代替个人为自己的行为负责，这一点要和第 2 条一起用。",
    plain:
      "一件事总出错，先别骂人。先看三件事：这事谁负责？什么时候检查？做到什么样算完？把这些写清楚，再把合适的人放上去。环境改了，人的做法常常会跟着变。",
    check: "小组作业总有人拖，你第一步先改什么？",
    evidence: [
      { book: "sunzi", links: [sunzi(5, "兵势")], angle: "战略：求之于势，不责于人" },
      {
        book: "ruiprincipal",
        links: [rui("machine", "操作机器"), rui("people", "选对人")],
        angle: "方法：先诊断原因，改动写回流程",
      },
      { book: "ep", links: [ep("aggression", "攻击")], angle: "科学：条件和代价变了，行为的频率就变" },
      {
        book: "lijiu",
        links: [lijiu("incentives", "看激励"), lijiu("choose-company", "选择同伴")],
        angle: "古典：《史记·货殖列传》；《荀子·劝学》",
      },
    ],
  },
  {
    n: 8,
    dimension: "action",
    title: "先定终点，把力气集中在少数要事上",
    understand: "为什么很努力，却不知道努力是为了什么？",
    core: "先写清要去哪里，再把时间先给最要紧的几件事。",
    logic: [
      "柯维说，先按想成为的人来做决定；重要的事往往很安静，要先把它放进时间里。",
      "达利欧的五步，第一步就是定目标，然后找出根本原因。根本原因，就是少数能决定大多数结果的那一处。",
      "孙子说，目的要尽量完整地达成，百战百胜不算最好。做法上要集中：我方集中、对方分散，就能以多打少。",
      "历久引帕累托的观察：少数原因决定大部分结果。又引「记住你会死」：正因为时间有限，选择才有分量。",
    ],
    limits: "安全、健康这类领域，由最短的那块板决定，不能只抓少数几件。",
    plain:
      "先写一句「我最后想成为什么样的人」。这周只挑三件对这句话最要紧的事，先写进具体的时间。别的事往后排，有些可以做得粗一点。但安全和健康不能省。",
    check: "你这周最重要的三件事，写进日程了吗？",
    evidence: [
      {
        book: "7habit",
        links: [habit("habit-2", "以终为始"), habit("habit-3", "要事第一")],
        angle: "经验：以终为始；要事第一",
      },
      { book: "ruiprincipal", links: [rui("five-steps", "五步流程")], angle: "方法：先定目标，再找根本原因" },
      { book: "sunzi", links: [sunzi(3, "谋攻"), sunzi(6, "虚实")], angle: "战略：完整达成目的；集中力量打虚处" },
      { book: "zhouyi", links: [gua(6, "讼")], angle: "象：作事谋始" },
      {
        book: "lijiu",
        links: [lijiu("vital-few", "抓主要矛盾"), lijiu("memento-mori", "记住你会死")],
        angle: "观察与古典：帕累托；《庄子·养生主》",
      },
    ],
  },
  {
    n: 9,
    dimension: "action",
    title: "先小步试，再持续做，积累成形",
    understand: "为什么下了很多大决心，生活还是没变？为什么想得越周全，越迟迟动不了手？",
    core: "先小规模试一次，拿到信息；再每天做一点，人就长成那个样子。",
    logic: [
      "停在原地想，只会得到越来越精致的想象。先迈出一小步，行动本身会带回信息，计划才变得可行。达利欧的五步也是这样：做完一轮，看结果，再回头改设计。",
      "试出来的做法要反复做。德行不是想出来的，是反复做出来的，亚里士多德和荀子都这样说。复利难的不是幅度，是持续。",
      "柯维把七个习惯当成连着走的一条路。习惯七要定期「磨锯」，前面的能力才不会断电。",
      "周易的升卦说「积小以高大」；渐卦说循序渐进，跳级就危险；恒卦说站定了就不轻易改方向。",
      "达利欧说原则要少写几条，试用一次，看结果再改。所以小步既是往前走，也是小步修正。",
    ],
    limits:
      "先试一试只适用于能挽回、能小规模试错的事；挽回不了、代价很高的决定，要先想清楚，按第 10 条慢做。习惯一旦不再经过思考，环境变了它也不会提醒你，所以要配合第 1 条定期检查。复利也会被中断，它不是保证。",
    plain:
      "别等想清楚全部，也别等下一次大决心。先挑一件小事试一次，看看结果。行得通，明天再做；行不通，改一点再试。坚持比用力重要。每隔一阵子回头看看：这个做法还适合现在吗？",
    check: "你想养成的那个习惯，今天能试的最小一步是什么？试完你打算看哪个结果？",
    evidence: [
      {
        book: "lijiu",
        links: [
          lijiu("start-small", "先迈出第一步"),
          lijiu("virtue-is-habit", "德行是练出来的"),
          lijiu("compounding", "复利"),
        ],
        angle: "古典：《道德经》第六十四章；亚里士多德；《荀子·劝学》",
      },
      {
        book: "7habit",
        links: [habit("path", "一条成长的路"), habit("habit-7", "不断更新")],
        angle: "经验：成果和产出成果的能力都要保住；磨锯",
      },
      {
        book: "zhouyi",
        links: [gua(46, "升"), gua(53, "渐"), gua(32, "恒")],
        angle: "象：积小成大；循序渐进；恒久",
      },
      {
        book: "ruiprincipal",
        links: [rui("five-steps", "五步流程"), rui("together", "写成自己的")],
        angle: "方法：做完一轮看结果再改；少写几条，试用以后再改",
      },
    ],
  },
  {
    n: 10,
    dimension: "risk",
    title: "先立于不败，越顺越要备",
    understand: "为什么很多人不是输在最难的时候，而是输在最顺的时候？",
    core: "先确保自己不会出局，再求赢；越顺越要留余地。",
    logic: [
      "孙子说，先让自己不可被战胜，再等待对方露出空隙；不要指望对方不来，要靠自己有准备。",
      "历久说，只要归零一次，之前所有的正确都跟着归零。而准备的时机，恰好是你觉得不需要准备的时候。",
      "进化心理学解释了这种「不对称」的来历：误报一次代价很小，漏掉一次真正的危险可能致命。",
      "柯维说，既要金蛋，也要那只下金蛋的鹅。",
      "周易的泰卦和既济卦都提醒：顺境也要防盛极而衰，事情成了以后最容易乱。达利欧的低谷说明，成功过的人照样会在最有把握的地方彻底看错。",
      "能挽回的事可以快做，挽回不了的要慢做。孙子说「亡国不可以复存」。",
    ],
    limits: "环境剧变时，一动不动也是风险。要分清哪些风险扛得住。",
    plain:
      "做事先问：最坏会怎样？我扛不扛得住？扛不住的别碰。事情顺的时候最容易放松，这时更要留一点余钱、余力和睡眠。",
    check: "你现在做的事里，哪一件一旦失败就回不来？",
    evidence: [
      {
        book: "sunzi",
        links: [sunzi(4, "军形"), sunzi(8, "九变"), sunzi(12, "火攻")],
        angle: "战略：先为不可胜；恃吾有以待；亡国不可复存",
      },
      {
        book: "lijiu",
        links: [
          lijiu("survive-first", "先活下来"),
          lijiu("prepare-in-peace", "居安思危"),
          lijiu("irreversible-first", "区分可逆与不可逆"),
        ],
        angle: "古典：谚语；《左传·襄公十一年》",
      },
      { book: "ep", links: [ep("survival", "活下来")], angle: "科学：误报和漏报的代价不对称" },
      { book: "7habit", links: [habit("path", "一条成长的路")], angle: "经验：金蛋和鹅都要" },
      {
        book: "zhouyi",
        links: [gua(11, "泰"), gua(63, "既济"), gua(15, "谦")],
        angle: "象：盛极要防衰；初吉终乱；自满会遮住反馈",
      },
      { book: "ruiprincipal", links: [rui("origin", "从哪里来")], angle: "亲历：成功过的人照样会看错" },
    ],
  },
  {
    n: 11,
    dimension: "adversity",
    title: "疼是信号：把挫折变成修正",
    understand: "同样摔一跤，为什么有人越摔越好，有人一直摔进同一个坑？",
    core: "疼加上准确的反省，才会变成下一次的办法。",
    logic: [
      "疼本身不会让人变好。躲开，会再犯；只骂自己或只怪别人，也不会进步。中间要准确地问一句：我哪个看法错了？",
      "历久引爱比克泰德：困扰人的常常是自己的解释，不是事情本身，而解释是可以练的。又引塞翁失马：事情刚发生时就定好坏，常常定错。",
      "周易的复卦说，走偏了要尽早回来；震卦说，先承认害怕，再恢复做事；蹇卦说，先改自己能改的，不是把一切都怪到自己头上。",
      "柯维借弗兰克尔的话：极端的环境拿不走人选择态度的能力。",
    ],
    limits:
      "急性创伤、剧痛或抑郁的时候，先需要安全、医疗和支持，不是找意义。真实的危险面前，要改的是处境，不是想法。",
    plain:
      "跌倒以后，先别急着骂自己或怪别人。写下三句：发生了什么？我哪一步想错了？下次换成什么做法？写完这一页，疼才没有白疼。真的很痛的时候，先找人帮忙。",
    check: "最近一次失败，你写下的是「我真差」，还是「下次我改哪一步」？",
    evidence: [
      { book: "ruiprincipal", links: [rui("origin", "从哪里来")], angle: "亲历：痛苦加反省才等于进步" },
      {
        book: "lijiu",
        links: [lijiu("judgment-not-events", "困扰你的是解释"), lijiu("blessing-in-disguise", "塞翁失马")],
        angle: "古典：爱比克泰德《手册》第五章；《淮南子》",
      },
      {
        book: "zhouyi",
        links: [gua(24, "复"), gua(51, "震"), gua(39, "蹇")],
        angle: "象：不远而复；恐惧修省；反身修德",
      },
      { book: "7habit", links: [habit("habit-1", "积极主动")], angle: "经验：借弗兰克尔，态度是最后的自由" },
    ],
  },
  {
    n: 12,
    dimension: "meaning",
    title: "看时与度：该进则进，该止则止",
    understand: "同一件事，这时做是对的，那时做就错；做一点是好的，做过头就坏了。",
    core: "没有永远对的动作，要看时机，也要看分寸。",
    logic: [
      "局势会变。孙子说「兵无常势，水无常形」，要跟着对方的变化取胜。历久说，痛苦常来自把暂时的状态当成永久。",
      "局势会变，所以要懂得停。孙子说「合于利而动，不合于利而止」，有的路不走，有的城不攻。历久引《道德经》：知足不辱，知止不殆。周易的艮卦说，该停的时候就停。",
      "分寸也要拿捏：过犹不及。节卦说「苦节不可贞」，节制过了头也不对；乾卦说刚健也要合时机，否则亢龙有悔。",
    ],
    limits: "原则问题没有中间地带，残忍、欺骗、背叛谈不上「适度」。也别在还没熬过平台期的时候，就提前喊「够了」。",
    plain:
      "好东西也有「刚刚好」，学习、运动、帮人都是这样。太少不行，太多也会坏。情况变了，做法跟着改。该停的时候停，不算输。但骗人、欺负人这种事，没有「适度」一说。",
    check: "你最近有没有一件事，是因为「不肯停」才变坏的？",
    evidence: [
      {
        book: "sunzi",
        links: [sunzi(6, "虚实"), sunzi(8, "九变"), sunzi(12, "火攻")],
        angle: "战略：兵无常势；有所不为；合于利而动",
      },
      {
        book: "lijiu",
        links: [
          lijiu("golden-mean", "过犹不及"),
          lijiu("know-when-enough", "知足知止"),
          lijiu("impermanence", "一切都会变"),
        ],
        angle: "古典：《论语·先进》；《道德经》第四十四章；赫拉克利特",
      },
      {
        book: "zhouyi",
        links: [gua(1, "乾"), gua(52, "艮"), gua(60, "节")],
        angle: "象：合乎时机与位置；时止则止；苦节不可贞",
      },
    ],
  },
];

export const candidates: Candidate[] = [
  {
    title: "争执中途解决，别争到底",
    links: [
      { book: "zhouyi", ...gua(6, "讼：中吉终凶") },
      { book: "sunzi", ...sunzi(3, "谋攻：不战而屈人之兵") },
    ],
  },
  {
    title: "疏远的时候，先别往坏处想",
    links: [
      { book: "lijiu", ...lijiu("hanlons-razor", "汉隆剃刀") },
      { book: "zhouyi", ...gua(38, "睽：疏离时恐惧会放大想象") },
    ],
  },
  {
    title: "身边的人会塑造你",
    links: [
      { book: "lijiu", ...lijiu("choose-company", "选择同伴") },
      { book: "zhouyi", ...gua(17, "随：跟对人、跟对时") },
    ],
  },
  {
    title: "有限，让选择有分量",
    links: [
      { book: "lijiu", ...lijiu("memento-mori", "记住你会死") },
      { book: "7habit", ...habit("habit-2", "以终为始") },
    ],
  },
  {
    title: "身体和精力是底座",
    links: [
      { book: "7habit", ...habit("habit-7", "不断更新") },
      { book: "lijiu", ...lijiu("do-hard-things", "做难而正确的事：长期高压必须配恢复") },
    ],
  },
  {
    title: "已经付出的不算，只看接下来",
    links: [
      { book: "lijiu", ...lijiu("sunk-cost", "沉没成本") },
      { book: "ruiprincipal", ...rui("decide", "做决定：看期望值") },
    ],
  },
];
