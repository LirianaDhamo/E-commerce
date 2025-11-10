import { ref, computed, watch } from 'vue'

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  image?: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

const cart = ref<Product[]>([])

// ✅ Load once when running in the browser
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cart.value = JSON.parse(savedCart)
  }
}

// ✅ Add to cart
function addToCart(product: Product) {
  const exists = cart.value.find(p => p.id === product.id)
  if (!exists) {
    cart.value.push(product)
  }
}

// ✅ Remove a specific product
function removeFromCart(productId: number) {
  cart.value = cart.value.filter(p => p.id !== productId)
}

// ✅ Clear all items
function clearCart() {
  cart.value = []
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cart')
  }
}

// ✅ Compute total
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price, 0)
)

// ✅ Watch for changes & persist
watch(
  cart,
  (newCart) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(newCart))
    }
  },
  { deep: true }
)

// ✅ Export composable
export function useCart() {
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    totalPrice
  }
}
