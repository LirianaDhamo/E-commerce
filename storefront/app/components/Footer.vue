<template>
  <footer class="footer">
    <p>© 2025 STORE. All rights reserved.</p>
    <nav>
      <NuxtLink to="/">Privacy</NuxtLink>
      <NuxtLink to="/">Terms</NuxtLink>
    </nav>
  </footer>
</template>

<style scoped>
.footer {
  background: #111;
  color: #888;
  text-align: center;
  padding: 1.5rem;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.5);
  font-size: 0.9rem;
}

.footer nav {
  margin-top: 0.5rem;
}

.footer nav a {
  color: #888;
  text-decoration: none;
  margin: 0 0.5rem;
  transition: color 0.2s;
}

.footer nav a:hover {
  color: #fff;
}
</style>
