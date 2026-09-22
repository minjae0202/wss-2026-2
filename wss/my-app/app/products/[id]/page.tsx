import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/products";
import { LikeButton } from "@/components/LikeButton";

// [id] 폴더 이름의 대괄호가 "동적 세그먼트"를 의미합니다.
// /products/1, /products/2 처럼 어떤 값이 오든 이 파일 하나가 처리합니다.
// Next.js 16에서 params는 Promise이므로 반드시 await 해야 합니다.
type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    // app/not-found.tsx(있다면)로 자동 이동, 없으면 Next.js 기본 404
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 px-8 py-16">
      <Link href="/products" className="text-sm text-zinc-500 hover:underline">
        ← 목록으로
      </Link>
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">{product.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>
      <LikeButton id={product.id} initialLikes={product.likes} />
    </div>
  );
}
