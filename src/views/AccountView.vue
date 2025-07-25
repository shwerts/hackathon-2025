<script setup>
import Account from '../components/Account.vue'
import Login from '../components/Login.vue';
import Register from '@/components/Register.vue';

import { useHead } from '@unhead/vue'
import { db, auth } from '@/firebase';
import { ref } from 'vue';

import { doc, getDoc, getDocFromServer } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

useHead({
  title: 'Account Page',
  meta: [
    { name: 'description', content: 'Manage your account settings and profile.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
});
const user = ref(null);

onAuthStateChanged(auth, async (currentUser) => {
  if (currentUser) {
    user.value = currentUser;
  } else {
    user.value = null;
  }
});

function loadingBar() {
  // Placeholder for loading bar logic
  console.log('Loading bar function called');
  // You can implement a loading bar here if needed
  // For example, you can use a library or custom CSS to show a loading indicator
  // This is just a placeholder function for demonstration
  return true; // Indicating loading is complete
  // You can return false if loading is still in progress
  // or implement a more complex loading state management
  // using reactive variables or state management libraries.
  // For now, it just returns true to indicate loading is complete
  // and can be used to control UI elements like buttons or forms.
  // You can also use this function to show/hide loading indicators
  // or to disable/enable buttons while loading is in progress.
  // This is a simple example, and you can expand it based on your requirements.
  // For example, you can use a reactive variable to track loading state
  // and update the UI accordingly.
}
</script>

<template>
  <Account v-if="user" :userName="user.displayName"/>
  <Register v-else />
</template>