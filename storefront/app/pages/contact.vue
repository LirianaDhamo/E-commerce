<template>
  <div class="contact-page">
    <h1>Contact Us</h1>
    <form>
      <label>
        Name
        <input type="text" placeholder="Your Name" />
      </label>

      <label>
        Email
        <input type="email" placeholder="you@example.com" />
      </label>

      <label>
        Message
        <textarea rows="5" placeholder="Write your message here..."></textarea>
      </label>

      <button type="submit">Send Message</button>
    </form>
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: transparent; /* transparent background */
  color: #eee;
  border-radius: 10px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 500;
  color: #fff;
}

label {
  display: block;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: #ccc;
}

input,
textarea {
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.25rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  background: #3a3a3a; /* dark gray inputs */
  color: #eee;
}

input::placeholder,
textarea::placeholder {
  color: #999;
}

button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #555;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #777;
}
</style>
