import Link from 'next/link'
import { getProducts } from '@/lib/products'
import { addToCartAction } from '@/lib/actions'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="mx-auto max-w-2xl flex-1 px-8 py-16">
      <h1 className="mb-2 text-2xl font-semibold text-black dark:text-zinc-50">
        쇼핑몰 — 상품 목록
      </h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        MongoDB 컬렉션에서 불러온 실제 상품입니다. 담기 버튼을 누르면 쿠키 기반
        장바구니(lib/cart.ts)에 저장됩니다 — 로그인하지 않아도 사용할 수
        있습니다.
      </p>
      <ul className="flex flex-col gap-4">
        {products.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-4 rounded-lg border border-black/[.08] px-5 py-4 dark:border-white/[.145]"
          >
            <span className="text-3xl" aria-hidden>
              {p.emoji}
            </span>
            <Link
              href={`/products/${p.id}`}
              className="flex-1 transition-colors hover:opacity-80"
            >
              <p className="font-medium text-black dark:text-zinc-50">
                {p.name}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {p.description} · {p.price.toLocaleString()}원 · 재고 {p.stock}
                개 · 좋아요 {p.likes}
              </p>
            </Link>
            <form action={addToCartAction}>
              <input type="hidden" name="productId" value={p.id} />
              <input type="hidden" name="qty" value={1} />
              <button
                type="submit"
                disabled={p.stock === 0}
                className="rounded-md border border-black/[.08] px-3 py-1.5 text-sm hover:bg-black/[.03] disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[.145] dark:hover:bg-white/[.05]"
              >
                {p.stock === 0 ? '품절' : '담기'}
              </button>
            </form>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          href="/cart"
          className="text-sm font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
        >
          장바구니 보기 →
        </Link>
      </div>
    </div>
  )
}
