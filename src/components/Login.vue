<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Login Page',
  meta: [
    { name: 'description', content: 'Login to your account.' }
  ]
});

const email = ref('');
const password = ref('');
const loginError = ref('');
const loginSuccess = ref(false);

async function login() {
  if (!email.value || !password.value) {
    loginError.value = 'Please enter both email and password.';
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    loginSuccess.value = true;
  } catch (error) {
    console.error('Error signing in:', error);
    switch (error.code) {
      case 'auth/email-already-in-use':
        loginError.value = 'This email is already in use.';
        break;
      case 'auth/invalid-email':
        loginError.value = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        loginError.value = 'Password should be at least 6 characters.';
        break;
      case 'auth/invalid-credential':
        loginError.value = 'Invalid credentials provided.';
        break;
      default:
        loginError.value = 'An unexpected error occurred. Please try again.';
    }
  }
}
</script>
<template>
  <h1 class="text-3xl font-bold mb-6 text-center">Log in</h1>
  <form
    @submit.prevent
    class="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center gap-6 w-min m-auto">
    <div class="flex flex-col">
      <label for="email" class="text-xl font-bold mb-2">E-mail</label>
      <input
        v-model="email"
        class="border-2 w-64 p-2 rounded-md border-gray-400 border-solid"
        type="text" name="email" id="email" required placeholder="youremail@mail.com">
    </div>
    <div class="flex flex-col">
      <label for="pwd" class="text-xl font-bold mb-2">Password</label>
      <input
        v-model="password"
        class="border-2 w-64 p-2 rounded-md border-gray-400 border-solid"
        type="text" name="password" id="pwd" required placeholder="password">
    </div>
    <button
      class="bg-gray-300 w-min p-2 rounded-md font-bold"
      @click="login">Log&nbsp;in</button>

    <div v-if="loginError" class="text-red-600">{{ loginError }}</div>
    <div v-if="loginSuccess" class="text-green-600">Login successful! You can go to account again.</div>
  </form>
  <p class="text-center text-gray-600 mt-4">
    Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register</a>
  </p>
</template>