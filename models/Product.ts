import { Schema, model, models } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    emoji: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Product = models.Product || model('Product', productSchema)
