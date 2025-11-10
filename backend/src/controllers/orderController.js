import { PrismaClient } from '@prisma/client'
import { createCheckoutSession, handleStripeWebhook } from '../stripe.js'

const prisma = new PrismaClient()

// 🟢 Create Stripe Checkout session
export const createCheckoutSessionHandler = async (req, res) => {
  try {
    const { cart } = req.body
    const url = await createCheckoutSession(cart)
    return res.json({ url })
  } catch (error) {
    console.error('❌ Error in createCheckoutSessionHandler:', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}

// 🟢 Stripe webhook (runs after payment success)
export const stripeWebhookHandler = async (req, res) => {
  try {
    await handleStripeWebhook(req, res, prisma)
  } catch (error) {
    console.error('❌ Error in stripeWebhookHandler:', error)
    res.status(500).json({ error: error.message || 'Something went wrong' })
  }
}
// 🟢 Get all orders for the dashboard
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } }, // 👈 includes product info for each order item
      },
      orderBy: { createdAt: 'desc' },
    })

    // ✅ Format the data with all the details
    const formatted = orders.map(order => ({
      id: order.id,
      email: order.email,
      amount:
        order.amount ||
        order.items.reduce(
          (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
          0
        ),
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(i => ({
        id: i.id, // 👈 include orderItem ID here
        quantity: i.quantity,
        price: i.price,
        product: i.product
          ? {
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
              image: i.product.image,
            }
          : null,
      })),
    }))

    res.json(formatted)
  } catch (error) {
    console.error('❌ Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}


