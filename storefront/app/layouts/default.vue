<template>
  <div class="layout">
    <Header />

    <div class="content">

      <main class="main-content">
        <slot />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #121212; /* dark page background */
  color: #eee;         /* default text color */
}

.content {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 2rem;
  background: #1a1a1a; /* dark gray instead of white */
  min-height: calc(100vh - 120px); /* leave space for header/footer */
}
</style>
