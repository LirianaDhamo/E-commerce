<template>
  <div class="cancel-container">
    <div class="cancel-card">
      <h1 class="cancel-title">❌ Payment Canceled</h1>
      <p class="cancel-message">Your payment was not completed.</p>
      <button class="home-button" @click="goHome">Return to Home</button>
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
.cancel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.cancel-card {
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 40px 60px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.cancel-title {
  color: #ef4444;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.cancel-message {
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
