<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { db, auth } from '@/firebase';
import { onMounted, ref } from 'vue';
import { getDocs, getDoc, doc, collection, query, where } from 'firebase/firestore';
import router from '@/router';

const userCred = auth.currentUser;
const user = ref(userCred ? userCred : null);
if (!userCred) {
  // Redirect to login if user is not authenticated
  router.push('/login');
}
const surveys = ref([]);
// Fetch surveys for the current user when the component is mounted
onMounted(async () => {
  const docRef = doc(db, "users", userCred.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    user.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
  if (user.value.role === 'personnel') {
    const surveysCollection = collection(db, 'surveys');
    const q = query(surveysCollection, where('createdBy', '==', userCred.uid));
    const surveySnapshot = await getDocs(q);
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
  <div v-if="user && user.role === 'personnel'" class="p-6">
    <div>
      <h1 class="text-2xl font-bold mb-4">Surveys</h1>
      <p class="mb-4">Here you can create and manage surveys.</p>
      <RouterLink class="bg-blue-600 text-white px-4 py-2 rounded" to="/create-survey">Create New Survey</RouterLink>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Active Surveys</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <li class="mb-2 bg-white rounded-2xl p-6 shadow-md" v-for="survey in surveys" :key="survey.id">
          {{ survey.title }} - {{ survey.responsesCount }} Responses
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    <p class="bg-red-500 text-white p-2 rounded">You do not have permission to create surveys.</p>
  </div>
</template>