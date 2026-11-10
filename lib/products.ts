import { connectDB } from '@/lib/mongodb'
import { Product as ProductModel } from '@/models/Product'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  emoji: string
  stock: number
  likes: number
}

type ProductDoc = {
  _id: unknown
  name: string
  description: string
  price: number
  emoji: string
  stock: number
  likes?: number
}

function toProduct(doc: ProductDoc): Product {
  return {
    id: String(doc._id),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    emoji: doc.emoji,
    stock: doc.stock,
    likes: doc.likes ?? 0,
  }
}

const SEED_PRODUCTS = [
  {
    name: '웹서버보안프로그래밍 머그컵',
    description: '수업 중 마실 커피를 위한 머그컵',
    price: 12000,
    emoji: '☕',
    stock: 42,
  },
  {
    name: 'Next.js 스티커 팩',
    description: '노트북에 붙이는 프레임워크 스티커 모음',
    price: 5000,
    emoji: '🏷️',
    stock: 100,
  },
  {
    name: 'OWASP Top 10 포스터',
    description: '책상 앞에 붙여두는 보안 체크리스트',
    price: 8000,
    emoji: '🛡️',
    stock: 30,
  },
  {
    name: '기계식 키보드',
    description: '타건감 좋은 87키 기계식 키보드',
    price: 89000,
    emoji: '⌨️',
    stock: 15,
  },
  {
    name: '노트북 거치대',
    description: '목/어깨 건강을 지키는 알루미늄 거치대',
    price: 32000,
    emoji: '💻',
    stock: 20,
  },
  {
    name: '노트북 키보드 스킨',
    description: '투명 재질의 부드러운 스킨',
    price: 7000,
    emoji: '💻',
    stock: 30,
  },
]

async function seedIfEmpty() {
  const count = await ProductModel.countDocuments()
  if (count === 0) {
    await ProductModel.insertMany(SEED_PRODUCTS)
  }
}

export async function getProducts(): Promise<Product[]> {
  await connectDB()
  await seedIfEmpty()
  const docs = await ProductModel.find()
    .sort({ createdAt: 1 })
    .lean<ProductDoc[]>()
  return docs.map(toProduct)
}

export async function getProduct(id: string): Promise<Product | null> {
  await connectDB()
  try {
    const doc = await ProductModel.findById(id).lean<ProductDoc | null>()
    return doc ? toProduct(doc) : null
  } catch {
    return null
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return []
  await connectDB()
  try {
    const docs = await ProductModel.find({ _id: { $in: ids } }).lean<
      ProductDoc[]
    >()
    return docs.map(toProduct)
  } catch {
    return []
  }
}

export async function decrementStock(productId: string, qty: number) {
  await connectDB()
  await ProductModel.updateOne({ _id: productId }, { $inc: { stock: -qty } })
}

export async function likeProduct(id: string): Promise<number> {
  await connectDB()
  try {
    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    ).lean<ProductDoc | null>()
    return doc?.likes ?? 0
  } catch {
    return 0
  }
}
