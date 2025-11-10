<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCart } from '~/composables/useCart'

interface Product {
  id: number
  name: string
  price: number
  image?: string | null
  quantity?: number
}

const { cart, clearCart } = useCart()
const typedCart = computed(() => cart.value as Product[])

const email = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

const totalAmount = computed(() =>
  typedCart.value.reduce((sum, p) => sum + p.price * (p.quantity ?? 1), 0)
)

async function placeOrder() {
  if (!email.value) {
    error.value = 'Please enter your email.'
    return
  }
  if (cart.value.length === 0) {
    error.value = 'Your cart is empty.'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Get saved quantities from localStorage or composable
    const savedQuantities = JSON.parse(localStorage.getItem('quantities') || '{}')

    const res = await fetch('http://localhost:5000/api/orders/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cart: cart.value.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          quantity: savedQuantities[p.id] ?? 1, // ✅ correct quantity!
        })),
      }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      throw new Error('Stripe checkout failed.')
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="checkout-container">
    <h1 class="checkout-title">Checkout</h1>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="checkout-content">
      <label class="checkout-label">Email Address</label>
      <input
        v-model="email"
        type="email"
        placeholder="you@example.com"
        class="checkout-input"
      />

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div v-if="cart.length === 0" class="empty-cart">
          Your cart is empty.
        </div>

        <div v-else>
          <div v-for="product in cart" :key="product.id" class="order-item">
            <div class="product-info">
              <img
                v-if="product.image"
                :src="`http://localhost:5000${product.image}`"
                alt="Product"
              />
              <span>{{ product.name }}</span>
            </div>
            <span class="product-price">${{ product.price }}</span>
          </div>

          <div class="order-total">
            <strong>Total:</strong>
            <strong>${{ totalAmount }}</strong>
          </div>
        </div>
      </div>

      <button
        class="checkout-button"
        :disabled="loading"
        @click="placeOrder"
      >
        {{ loading ? 'Redirecting...' : 'Place Order' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* === Layout === */
.checkout-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  font-family: 'Inter', sans-serif;
}

.checkout-title {
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #222;
}

/* === Inputs === */
.checkout-label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.checkout-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: border 0.2s;
}

.checkout-input:focus {
  border-color: #0070f3;
  outline: none;
}

/* === Order Summary === */
.order-summary {
  background: #f9f9f9;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
}

.order-summary h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-info img {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
}

.product-price {
  font-weight: 600;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 700;
  margin-top: 12px;
}

/* === Buttons === */
.checkout-button {
  width: 100%;
  background-color: #0070f3;
  color: #fff;
  font-weight: 600;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.checkout-button:hover:not(:disabled) {
  background-color: #0059c9;
}

.checkout-button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* === Error === */
.error-message {
  color: #e63946;
  background: #ffe5e7;
  padding: 10px 14px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
}

/* === Empty Cart === */
.empty-cart {
  text-align: center;
  color: #777;
  padding: 15px;
}
</style>
