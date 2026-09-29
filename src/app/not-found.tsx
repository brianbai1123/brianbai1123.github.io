import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold text-clay">这里没有这一页</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">页面不存在</h1>
      <p className="mt-4 leading-relaxed text-muted">
        十二条原则都在首页。六本书的每一章仍在各自原来的路径上，从首页最后的参考列表进去。
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8 w-fit`}>
        回到原则、思想、知与行
      </Link>
    </main>
  );
}
