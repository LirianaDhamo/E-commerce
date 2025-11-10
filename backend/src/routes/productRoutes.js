import express from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadMiddleware
} from '../controllers/productController.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', uploadMiddleware, createProduct)
router.put('/:id', uploadMiddleware, updateProduct)
router.delete('/:id', deleteProduct)

export default router
