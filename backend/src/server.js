import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { stripeWebhookHandler } from './controllers/orderController.js'

dotenv.config()
const app = express()

app.use(cors())

// Stripe webhook BEFORE express.json()
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler)

// Parse JSON for all other routes
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(5000, () => console.log('🚀 Server running on port 5000'))
