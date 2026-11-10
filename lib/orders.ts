import { connectDB } from '@/lib/mongodb'
import { Order as OrderModel } from '@/models/Order'

export type OrderItem = {
  productId: string
  name: string
  price: number
  qty: number
}

export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  createdAt: string
}

type OrderDoc = {
  _id: unknown
  userId: unknown
  items: { productId: unknown; name: string; price: number; qty: number }[]
  total: number
  createdAt: Date
}

function toOrder(doc: OrderDoc): Order {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    items: doc.items.map((i) => ({
      productId: String(i.productId),
      name: i.name,
      price: i.price,
      qty: i.qty,
    })),
    total: doc.total,
    createdAt: doc.createdAt.toISOString(),
  }
}

export async function createOrder(
  userId: string,
  items: OrderItem[],
): Promise<Order> {
  await connectDB()
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const doc = await OrderModel.create({ userId, items, total })
  return toOrder(doc.toObject())
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  await connectDB()
  const docs = await OrderModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean<OrderDoc[]>()
  return docs.map(toOrder)
}

export async function getOrder(id: string): Promise<Order | null> {
  await connectDB()
  try {
    const doc = await OrderModel.findById(id).lean<OrderDoc | null>()
    return doc ? toOrder(doc) : null
  } catch {
    return null
  }
}
