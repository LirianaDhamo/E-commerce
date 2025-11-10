import { PrismaClient } from '@prisma/client'
import multer from 'multer'

const prisma = new PrismaClient()
const upload = multer({ dest: 'uploads/' })
export const uploadMiddleware = upload.single('image')

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } })
    if (!product) return res.status(404).json({ error: 'Not found' })
    res.json(product)
  } catch {
    res.status(500).json({ error: 'Failed to fetch product' })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, active } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image, active: active === 'true' },
    })
    res.status(201).json(product)
  } catch {
    res.status(500).json({ error: 'Failed to create product' })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, price, active } = req.body

    const existing = await prisma.product.findUnique({ where: { id: parseInt(id) } })
    if (!existing) return res.status(404).json({ error: 'Product not found' })

    let image = existing.image
    if (req.file) {
      deleteFileIfExists(existing.image)
      image = `/uploads/${req.file.filename}`
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        active: active === 'true' || active === true
      }
    })

    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update product' })
  }
}
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ message: 'Deleted' })
  } catch {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
