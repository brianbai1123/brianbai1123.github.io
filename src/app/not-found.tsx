import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold text-clay">藏书室里没有这一页</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">页面不存在</h1>
      <p className="mt-4 leading-relaxed text-muted">六本书都从门厅进去。某一章的地址仍在各自原来的路径上。</p>
      <Link href="/" className={`${buttonVariants()} mt-8 w-fit`}>
        回到藏书室
      </Link>
    </main>
  );
}
