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
    const docRef = doc(db, "users", currentUser.uid);
    user.value = (await getDocFromServer(docRef)).data();
    console.log('User data:', user.value);
  } else {
    user.value = null;
  }
});
</script>

<template>
  <Account v-if="user" :userName="user.displayName"/>
  <Register v-else />
</template>