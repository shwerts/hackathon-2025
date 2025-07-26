<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { db, auth } from '@/firebase';
import { onMounted, ref } from 'vue';
import { collection, query, where, getDocsFromServer } from 'firebase/firestore';
import router from '@/router';

const user = auth.currentUser;
if (!user) {
  // Redirect to login if user is not authenticated
  router.push('/login');
}
const surveys = ref([]);
// Fetch surveys for the current user when the component is mounted
onMounted(async () => {
  if (user) {
    const surveysCollection = collection(db, 'surveys');
    const q = query(surveysCollection, where('createdBy', '==', user.uid));
    const surveySnapshot = await getDocsFromServer(q);
    surveySnapshot.forEach(doc => {
      surveys.value.push({
        id: doc.id,
        title: doc.data().title,
        responsesCount: doc.data().responsesCount || "No",
      });
    });
  }
});
</script>

<template>
  <!-- Only English version -->
  <div>
    <h1 class="text-2xl font-bold mb-4">Surveys</h1>
    <p class="mb-4">Here you can create and manage surveys.</p>
    <RouterLink class="bg-blue-600 text-white px-4 py-2 rounded" to="/create-survey">Create New Survey</RouterLink>
  </div>
  <div class="mt-6">
    <h2 class="text-xl font-semibold mb-2">Your Surveys</h2>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <li class="mb-2 bg-white rounded-2xl p-6 shadow-md" v-for="survey in surveys" :key="survey.id">
        {{ survey.title }} - {{ survey.responsesCount }} Responses
      </li>
    </ul>
  </div>
</template>