<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome, faShoppingCart, faInfoCircle, faEnvelope, faBox } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHome, faShoppingCart, faInfoCircle, faEnvelope, faBox)
</script>

<template>
  <aside class="sidebar">
    <nav>
      <NuxtLink to="/">
        <FontAwesomeIcon icon="fa-solid fa-home" /> Home
      </NuxtLink>
      <NuxtLink to="/cart">
        <FontAwesomeIcon icon="fa-solid fa-shopping-cart" /> Cart
      </NuxtLink>
      <NuxtLink to="/about">
        <FontAwesomeIcon icon="fa-solid fa-info-circle" /> About
      </NuxtLink>
      <NuxtLink to="/contact">
        <FontAwesomeIcon icon="fa-solid fa-envelope" /> Contact
      </NuxtLink>
      </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #111;
  color: #ccc;
  padding: 2rem 1rem;
  height: calc(100vh - 80px);
  position: sticky;
  top: 80px;
  box-shadow: 2px 0 8px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar nav a {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space between icon and text */
  text-decoration: none;
  color: #ccc;
  font-weight: 500;
  transition: color 0.2s;
}

.sidebar nav a:hover {
  color: #fff;
}
</style>
