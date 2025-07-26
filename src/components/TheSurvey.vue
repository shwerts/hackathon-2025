<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true
  }
});
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { auth, db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

const survey = ref(null);

onMounted(async () => {
  const docRef = doc(db, 'surveys', props.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    survey.value = docSnap.data();
  } else {
    console.log('No such document!');
  }
});
</script>

<template>
  <div v-if="survey">
    <h1 class="text-2xl font-bold mb-6">{{ survey.title }}</h1>
    <!-- Add more survey details here -->
    <ul>
      <li v-for="(question, index) in survey.questions" :key="index">
        <h2 class="text-xl font-semibold">{{ question }}</h2>
        <!-- Make textarea more visible to a user -->
        <textarea
          :name="'question_' + index" :id="'question_' + index"
          class="mt-4 block w-full border-2 border-gray-700 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >Write something...</textarea>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Loading survey...</p>
  </div>
</template>