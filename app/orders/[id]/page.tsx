import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { getOrder } from '@/lib/orders'

type Props = { params: Promise<{ id: string }> }

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }

  const order = await getOrder(id)
  if (!order) {
    notFound()
  }

  const isOwner = order.userId === session.user.id
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) {
    notFound()
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 px-8 py-16">
      <Link href="/orders" className="text-sm text-zinc-500 hover:underline">
        ← 주문 내역으로
      </Link>
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        주문 상세
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {new Date(order.createdAt).toLocaleString('ko-KR')}
        {isAdmin && !isOwner && (
          <span className="ml-2 rounded bg-black/[.06] px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-white/[.08] dark:text-zinc-300">
            관리자 열람
          </span>
        )}
      </p>

      <ul className="flex flex-col gap-3">
        {order.items.map((item) => (
          <li
            key={item.productId}
            className="flex items-center justify-between rounded-lg border border-black/[.08] px-5 py-3 dark:border-white/[.145]"
          >
            <span className="text-black dark:text-zinc-50">{item.name}</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {item.price.toLocaleString()}원 × {item.qty}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-black/[.08] pt-6 dark:border-white/[.145]">
        <p className="text-lg font-semibold text-black dark:text-zinc-50">
          총 {order.total.toLocaleString()}원
        </p>
      </div>
    </div>
  )
}
