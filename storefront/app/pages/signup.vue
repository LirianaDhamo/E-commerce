<script setup lang="ts">
definePageMeta({
  layout: 'auth' // tells Nuxt to use layouts/auth.vue
})
</script>

<template>
  <div class="auth-page">
    <form class="auth-form">
      <h1>Sign Up</h1>

      <label>
        Name
        <input type="text" placeholder="Your Name" />
      </label>

      <label>
        Email
        <input type="email" placeholder="you@example.com" />
      </label>

      <label>
        Password
        <input type="password" placeholder="Choose a password" />
      </label>

      <button type="submit">Sign Up</button>

      <p class="switch">
        Already have an account?
        <NuxtLink to="/login">Login here</NuxtLink>
      </p>

      <p class="skip">
        <NuxtLink to="/">Skip</NuxtLink>
      </p>
    </form>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
}

.auth-form {
  background: #2b2b2b;
  padding: 2.5rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  color: #eee;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1 { text-align: center; margin-bottom: 2rem; }

label { display: block; margin-bottom: 1.5rem; font-weight: 500; }

input {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.25rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background: #3a3a3a;
  color: #eee;
}

button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover { background: #777; }

.switch, .skip { margin-top: 1rem; text-align: center; }

.skip a { color: #ccc; text-decoration: underline; }
</style>
