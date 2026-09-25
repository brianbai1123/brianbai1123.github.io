import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold text-clay">这条路没有这一站</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">页面不存在</h1>
      <p className="mt-4 leading-relaxed text-muted">
        目录从整张地图开始，顺着原书走过生存、择偶、亲属和群居，再收成一套可以检验的问法。
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8 w-fit`}>
        回到开篇
      </Link>
    </main>
  );
}
