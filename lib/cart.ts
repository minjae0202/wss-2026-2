import { cookies } from 'next/headers'

const CART_COOKIE = 'cart'
const CART_MAX_AGE = 60 * 60 * 24 * 30

export type CartLine = { productId: string; qty: number }

async function readCart(): Promise<CartLine[]> {
  const store = await cookies()
  const raw = store.get(CART_COOKIE)?.value
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.productId === 'string' &&
        typeof line?.qty === 'number' &&
        line.qty > 0,
    )
  } catch {
    return []
  }
}

async function writeCart(lines: CartLine[]) {
  const store = await cookies()
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: CART_MAX_AGE,
  })
}

export async function getCartLines(): Promise<CartLine[]> {
  return readCart()
}

export async function getCartCount(): Promise<number> {
  const lines = await readCart()
  return lines.reduce((sum, line) => sum + line.qty, 0)
}

export async function addToCart(productId: string, qty: number) {
  const lines = await readCart()
  const existing = lines.find((line) => line.productId === productId)
  if (existing) {
    existing.qty += qty
  } else {
    lines.push({ productId, qty })
  }
  await writeCart(lines)
}

export async function updateCartQty(productId: string, qty: number) {
  const lines = await readCart()
  const next =
    qty <= 0
      ? lines.filter((line) => line.productId !== productId)
      : lines.map((line) =>
          line.productId === productId ? { ...line, qty } : line,
        )
  await writeCart(next)
}

export async function removeFromCart(productId: string) {
  const lines = await readCart()
  await writeCart(lines.filter((line) => line.productId !== productId))
}

export async function clearCart() {
  await writeCart([])
}
