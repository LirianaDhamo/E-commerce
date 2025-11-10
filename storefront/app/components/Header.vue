<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'

// Add icons to the library
library.add(faHome, faShoppingCart, faUser)
</script>

<template>
  <header class="header">
    <NuxtLink to="/" class="logo">STORE</NuxtLink>
    <nav class="nav">
      <NuxtLink to="/">
        <FontAwesomeIcon icon="fa-solid fa-home" />
      </NuxtLink>
      <NuxtLink to="/cart">
        <FontAwesomeIcon icon="fa-solid fa-shopping-cart" />
      </NuxtLink>
      <NuxtLink to="/profile">
        <FontAwesomeIcon icon="fa-solid fa-user" />
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: #111;
  color: #eee;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.logo {
  font-weight: 600;
  font-size: 1.5rem;
  color: #fff;
  text-decoration: none;
}

.nav a {
  margin-left: 2rem;
  color: #ccc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a:hover {
  color: #fff;
}
</style>
