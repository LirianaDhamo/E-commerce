<template>
  <div class="checkout-layout">
    <main class="checkout-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.checkout-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.checkout-content {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
</style>
