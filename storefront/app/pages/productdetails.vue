<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const product = ref<Product | null>(null)
const loading = ref(true)
const { addToCart } = useCart()

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${route.query.id}`)
    product.value = await res.json()
  } catch (e) {
    console.error('Failed to load product', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="product-page" v-if="product">
    <div class="product-container">
      <div class="image-section">
        <img
          v-if="product.image"
          :src="`http://localhost:5000${product.image}`"
          :alt="product.name"
        />
        <div v-else class="no-image">No image available</div>
      </div>

      <div class="details-section">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-description">
          {{ product.description || 'This trendy piece is perfect for your wardrobe!' }}
        </p>

        <div class="price-section">
          <span class="price">€{{ product.price }}</span>
          <span class="discount">-30%</span>
        </div>

        <div class="options">
          <div class="option-group">
            <label>Size:</label>
            <div class="sizes">
              <button v-for="size in ['S','M','L','XL']" :key="size" class="size-btn">
                {{ size }}
              </button>
            </div>
          </div>

          <div class="option-group">
            <label>Color:</label>
            <div class="colors">
              <span
                v-for="color in ['#000', '#f87171', '#60a5fa', '#16a34a']"
                :key="color"
                class="color-dot"
                :style="{ backgroundColor: color }"
              ></span>
            </div>
          </div>
        </div>

        <button class="add-to-cart" @click="addToCart(product as Product)">
          🛒 Add to Bag
        </button>

        <div class="delivery-info">
          <p>🚚 Free delivery on orders over €29</p>
          <p>💳 Secure payment via Stripe</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-page {
  background: #fff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 40px 20px;
  color: #111;
  font-family: 'Inter', 'Poppins', sans-serif;
}

.product-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  max-width: 1000px;
}

@media (min-width: 768px) {
  .product-container {
    flex-direction: row;
    align-items: center;
    gap: 40px;
  }
}

/* 🖼 Image section (smaller, fixed height like Shein) */
.image-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
  border-radius: 12px;
  overflow: hidden;
  height: 350px; /* smaller height */
  border: 1px solid #eee;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* so the image fits inside nicely */
  padding: 10px;
}

.no-image {
  color: #999;
  font-size: 1rem;
}

/* 📋 Details */
.details-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.product-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
}

.price {
  font-size: 1.6rem;
  color: #222;
  font-weight: 700;
}

.discount {
  color: #e11d48;
  font-weight: 600;
  font-size: 1rem;
}

/* Options */
.option-group {
  margin-bottom: 18px;
}

.option-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.sizes {
  display: flex;
  gap: 8px;
}

.size-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.size-btn:hover {
  background: #000;
  color: #fff;
}

.colors {
  display: flex;
  gap: 8px;
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-dot:hover {
  transform: scale(1.1);
  border-color: #000;
}

/* Button */
.add-to-cart {
  background: #000;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-top: 10px;
}

.add-to-cart:hover {
  background: #222;
  transform: translateY(-1px);
}

/* Info */
.delivery-info {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
}

.delivery-info p {
  margin: 4px 0;
}
</style>
