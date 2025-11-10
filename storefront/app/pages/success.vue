<template>
  <div class="success-container">
    <div class="success-card">
      <h1 class="success-title">✅ Payment Successful!</h1>
      <p class="success-message">Thank you for your order.</p>
      <button class="home-button" @click="goHome">Go Back to Home</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.success-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
  padding: 16px;
}

.success-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px 60px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.success-title {
  color: #22c55e;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.success-message {
  color: #374151;
  font-size: 1.1rem;
  margin-bottom: 24px;
}

.home-button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #1e40af;
}
</style>
