<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const products = ref<Product[]>([])
const loading = ref(true)
const router = useRouter()
const { addToCart } = useCart()

async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products')
    products.value = await res.json()
  } catch (err) {
    console.error('Failed to fetch products', err)
  } finally {
    loading.value = false
  }
}

function goToProductDetails(productId: number) {
  router.push({ path: '/productdetails', query: { id: productId } })
}

onMounted(fetchProducts)
</script>

<template>
  <div class="products-container">
    <h1 class="products-title">🛍️ Products</h1>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else-if="products.length === 0" class="no-products">
      No products found.
    </div>

    <div v-else class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image" @click="goToProductDetails(product.id)">
          <img
            v-if="product.image"
            :src="`http://localhost:5000${product.image}`"
            :alt="product.name"
          />
          <span v-else class="no-image">No Image</span>
        </div>

        <div class="product-info">
          <h2 @click="goToProductDetails(product.id)" class="clickable-title">
            {{ product.name }}
          </h2>
          <p>{{ product.description || 'No description provided.' }}</p>

          <!-- Static placeholders for sizes & colors -->
          <div class="product-options">
            <div class="sizes">
              <span v-for="size in ['S', 'M', 'L', 'XL']" :key="size" class="size">
                {{ size }}
              </span>
            </div>
            <div class="colors">
              <span v-for="color in ['#ff4d4d', '#4dabf7', '#000']" :key="color" class="color-dot" :style="{ backgroundColor: color }"></span>
            </div>
          </div>

          <p class="product-price">€{{ product.price }}</p>

          <button class="add-to-cart" @click="addToCart(product)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-container {
  padding: 40px 20px;
  color: #ddd;
  text-align: center;
  background-color: #0d0d0d;
  min-height: 100vh;
}

.products-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 32px;
  color: #f5f5f5;
  letter-spacing: 0.5px;
}

.loading,
.no-products {
  color: #888;
  padding: 60px 0;
  font-size: 1rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  justify-items: center;
}

.product-card {
  background-color: #1a1a1a;
  color: #eee;
  border-radius: 16px;
  overflow: hidden;
  width: 280px;
  display: flex;
  flex-direction: column;
  height: 420px; /* taller card for bigger image */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
}

/* --- IMAGE --- */
.product-image {
  flex: 1 1 auto;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.no-image {
  color: #777;
  font-size: 0.9rem;
}

/* --- INFO --- */
.product-info {
  flex: 0 0 auto;
  padding: 14px 16px;
  background-color: #1e1e1e;
  border-top: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.product-info h2 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info p {
  color: #aaa;
  font-size: 0.85rem;
  margin: 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  color: #4dabf7;
  font-weight: bold;
  margin-top: 6px;
}

/* --- ADD TO CART BUTTON --- */
.add-to-cart {
  margin-top: 10px;
  background: linear-gradient(90deg, #4dabf7, #1a73e8);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  text-align: center;
  transition: background 0.2s ease, transform 0.15s ease;
}

.add-to-cart:hover {
  background: linear-gradient(90deg, #1a73e8, #0d6efd);
  transform: translateY(-2px);
}
.clickable-title {
  cursor: pointer;
  color: #4dabf7;
  transition: color 0.2s ease;
}
.clickable-title:hover {
  color: #1a73e8;
}

.product-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.sizes {
  display: flex;
  gap: 6px;
}

.size {
  background: #2a2a2a;
  color: #ccc;
  padding: 3px 7px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #222;
}
.colors {
  display: flex;
  gap: 6px;
}

/* --- SMALL SCREEN ADJUSTMENTS --- */
@media (max-width: 600px) {
  .product-card {
    width: 100%;
    height: 380px;
  }

  .product-info {
    padding: 12px;
  }

  .products-title {
    font-size: 1.6rem;
  }
}
</style>


