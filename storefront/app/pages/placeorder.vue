<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '~/composables/useCart'

interface Product {
  id: number
  name: string
  price: number
  image?: string | null
  quantity?: number
}

const { cart } = useCart()

const typedCart = computed(() => cart.value as Product[])

async function placeOrder() {
  const res = await fetch('http://localhost:5000/api/orders/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cart: typedCart.value.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity ?? 1,
      })),
    }),
  })

  const data = await res.json()
  if (data.url) window.location.href = data.url
  else alert('Something went wrong!')
}
</script>


<template>
  <button @click="placeOrder" class="bg-blue-500 text-white px-4 py-2 rounded">
    Place Order
  </button>
</template>
