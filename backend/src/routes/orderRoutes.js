import express from 'express'
import {
  createCheckoutSessionHandler,
  getAllOrders,
  stripeWebhookHandler
} from '../controllers/orderController.js'

const router = express.Router()

router.post('/create-checkout-session', createCheckoutSessionHandler)
router.get('/', getAllOrders)

export default router
