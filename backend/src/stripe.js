import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()

export const createCheckoutSession = async (cart) => {
  if (!cart || cart.length === 0) throw new Error('Cart is empty')

  // 🟢 Fetch Stripe key from DB
  const stripeKey = await prisma.setting.findUnique({ where: { key: 'STRIPE_SECRET_KEY' } })
  const stripe = new Stripe(stripeKey?.value)

  const line_items = cart.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: { name: item.name },
      unit_amount: Math.round((item.price ?? 0) * 100),
    },
    quantity: item.quantity || 1,
  }))

  const metadataCart = cart.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity || 1,
    unit_amount: Math.round((item.price ?? 0) * 100),
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items,
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
    metadata: { cart: JSON.stringify(metadataCart) },
  })

  return session.url
}

export const handleStripeWebhook = async (req, res) => {
  // 🟢 Fetch webhook secret from DB
  const webhookSecret = await prisma.setting.findUnique({ where: { key: 'STRIPE_WEBHOOK_SECRET' } })
  const stripeKey = await prisma.setting.findUnique({ where: { key: 'STRIPE_SECRET_KEY' } })
  const stripe = new Stripe(stripeKey?.value)

  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret?.value)
  } catch (err) {
    console.error('❌ Webhook verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const metadataCart = session.metadata?.cart ? JSON.parse(session.metadata.cart) : []

    await prisma.order.create({
      data: {
        email: session.customer_details?.email || 'unknown@example.com',
        amount: session.amount_total,
        status: 'PAID',
        stripeId: session.id,
        items: {
          create: metadataCart.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.unit_amount,
          })),
        },
      },
    })
  }

  res.status(200).json({ received: true })
}
