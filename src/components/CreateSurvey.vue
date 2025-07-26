<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { db, auth } from '@/firebase';
import { onMounted, ref } from 'vue';
import router from '@/router';
import { doc, addDoc, collection, getDoc } from 'firebase/firestore';

const user = ref(auth.currentUser);
if (!user.value) {
  router.push('/login');
}

onMounted(async () => {
  const docRef = doc(db, "users", user.value.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    user.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
});

const title = ref('');
async function createSurvey() {
  if (!user) {
    console.error('User not authenticated');
    return;
  }
  else if (title.value.trim() === '') {
    console.error('Survey title cannot be empty');
    return;
  }
  try {
    const surveyRef = await addDoc(collection(db, 'surveys'), {
      createdAt: new Date(),
      createdBy: user.uid,
      title: title.value,
      responsesCount: 0,
    });
    console.log('Survey created with ID:', surveyRef.id);
  } catch (error) {
    console.error('Error creating survey:', error);
  }
}
</script>

<template>
  <!-- Creating a new survey -->
  <div v-if="user && user.role === 'personnel'" class="p-6">
    <h1 class="text-2xl font-bold mb-4">Create Survey</h1>
    <p class="mb-4">Use the form below to create a new survey.</p>
    <form
      @submit.prevent
      class="bg-white rounded-lg p-6 shadow-md">
      <div class="mb-4">
        <label for="surveyTitle" class="block text-sm font-medium text-gray-700">Survey Title</label>
        <input type="text" id="surveyTitle" required v-model="title"
               placeholder="Enter survey title"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
      </div>
      <button
        @click="createSurvey"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        type="submit">Create Survey</button>
    </form>
  </div>
  <div v-else>
    <p class="bg-red-500 text-white p-2 rounded">You do not have permission to create surveys.</p>
  </div>
</template>