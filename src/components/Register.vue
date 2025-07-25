<script setup>
import { ref } from 'vue'
import { db, auth } from '@/firebase'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Register Page',
  meta: [
    { name: 'description', content: 'Register to create a new account.' }
  ]
});

const email = ref('');
const password = ref('');
const name = ref('');
const registrationSuccess = ref(false);
const registrationError = ref('');

async function register() {
  if (!email.value || !password.value || !name.value) {
    registrationError.value = 'Please enter every field of registration form.';
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('User registered successfully');

    updateProfile(userCredential.user, {
      displayName: name.value
    })
    .then(() => {
      console.log('Profile updated successfully');
      registrationSuccess.value = true;
    })
    .catch((error) => {
      console.error('Error updating profile:', error);
      registrationError.value = 'Failed to update profile.';
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      createdAt: serverTimestamp(),
      displayName: name.value
    });
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        registrationError.value = 'This email is already in use.';
        break;
      case 'auth/invalid-email':
        registrationError.value = 'Invalid email address.';
        break;
      case 'auth/weak-password':
        registrationError.value = 'Password should be at least 6 characters.';
        break;
      default:
        registrationError.value = 'An unexpected error occurred. Please try again.';
    }
  }
}
</script>
<template>
  <h1 class="text-3xl font-bold mb-6 text-center">Registration</h1>
  <form @submit.prevent
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
    <div class="flex flex-col">
      <label for="name" class="text-xl font-bold mb-2">Name</label>
      <input
        v-model="name"
        class="border-2 w-64 p-2 rounded-md border-gray-400 border-solid"
        type="text" name="name" id="name" required placeholder="Your Name">
    </div>
    <button
      class="bg-gray-300 w-min p-2 rounded-md font-bold"
      @click="register">Register</button>

    <div v-if="registrationSuccess" class="text-green-600">Registration successful!</div>

    <div v-if="registrationError" class="text-red-600">{{ registrationError }}</div>
  </form>
  <p class="text-center text-gray-600 mt-4">
    Already have an account? <a href="/login" class="text-blue-600 hover:underline">Login</a>
  </p>
</template>