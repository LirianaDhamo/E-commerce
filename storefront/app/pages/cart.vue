<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCart } from '~/composables/useCart'

interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

const { cart, removeFromCart } = useCart()

const quantities = ref<Record<number, number>>({})

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('quantities') || '{}')
  quantities.value = saved
})

watch(
  quantities,
  (newQuantities) => {
    localStorage.setItem('quantities', JSON.stringify(newQuantities))
  },
  { deep: true }
)

watch(
  cart,
  (newCart) => {
    newCart.forEach((p: Product) => {
      if (quantities.value[p.id] === undefined) {
        quantities.value[p.id] = 1
      }
    })
  },
  { immediate: true }
)

function increaseQty(id: number) {
  quantities.value[id] = (quantities.value[id] ?? 1) + 1
}

function decreaseQty(id: number) {
  const current = quantities.value[id] ?? 1
  if (current > 1) {
    quantities.value[id] = current - 1
  } else {
    removeFromCart(id)
    delete quantities.value[id]
  }
}

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => {
    const qty = quantities.value[item.id] ?? 1
    return sum + item.price * qty
  }, 0)
)
</script>

<template>
  <div class="cart-page">
    <!-- Header -->
    <header class="cart-header">
      <h1>🛒 Your Cart</h1>
    </header>

    <!-- Middle scrollable section -->
    <div class="cart-scroll">
      <div v-if="cart.length === 0" class="empty-cart">
        Your cart is empty.
      </div>

      <div v-else>
        <div
          v-for="product in cart"
          :key="product.id"
          class="cart-item"
        >
          <div class="cart-item-image">
            <img
              v-if="product.image"
              :src="`http://localhost:5000${product.image}`"
              :alt="product.name"
            />
            <span v-else class="no-image">No Image</span>
          </div>

          <div class="cart-item-info">
            <div class="top-info">
              <h2>{{ product.name }}</h2>
              <p class="desc">{{ product.description || 'No description available.' }}</p>
            </div>

            <div class="bottom-info">
              <p class="price">${{ product.price }}</p>
              <div class="quantity-control">
                <button @click="decreaseQty(product.id)">−</button>
                <span>{{ quantities[product.id] ?? 1 }}</span>
                <button @click="increaseQty(product.id)">＋</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Footer -->
    <footer class="cart-footer">
      <div class="cart-summary">
        <p>Total: <strong>${{ totalPrice }}</strong></p>
        <NuxtLink to="/checkout">
          <button class="checkout-btn">Checkout</button>
      </NuxtLink>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.cart-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #111;
  color: #ddd;
}

/* Header */
.cart-header {
  flex-shrink: 0;
  background: #1a1a1a;
  padding: 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid #333;
}

/* Scrollable middle content */
.cart-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  scrollbar-width: thin;
}

.cart-scroll::-webkit-scrollbar {
  width: 6px;
}

.cart-scroll::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 10px;
}

.empty-cart {
  text-align: center;
  color: #888;
  padding: 50px 0;
}

/* Cart item */
.cart-item {
  display: flex;
  background: #222;
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.cart-item-image {
  flex: 0 0 120px;
  height: 120px;
  background: #333;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-right: 16px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #777;
  font-size: 0.9rem;
}

/* Info */
.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-info h2 {
  font-size: 1.1rem;
  color: #fff;
  margin-bottom: 6px;
}

.desc {
  color: #aaa;
  font-size: 0.9rem;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #4dabf7;
  font-weight: bold;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-control button {
  background: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  font-size: 1.2rem;
  cursor: pointer;
}

.quantity-control button:hover {
  background: #555;
}

/* Footer stays fixed */
.cart-footer {
  flex-shrink: 0;
  background: #1a1a1a;
  border-top: 1px solid #333;
  padding: 16px;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 700px;
  margin: 0 auto;
}

.checkout-btn {
  background: #4dabf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.checkout-btn:hover {
  background: #1a73e8;
}
</style>
