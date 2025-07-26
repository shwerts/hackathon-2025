<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { db, auth } from '@/firebase';
import { onMounted, ref } from 'vue';
import router from '@/router';
import { doc, addDoc, collection, getDocFromServer } from 'firebase/firestore';

const userCred = ref(auth.currentUser);
const user = ref(null);
if (!userCred.value) {
  router.push('/login');
}

onMounted(async () => {
  const docRef = doc(db, "users", userCred.value.uid);
  const docSnap = await getDocFromServer(docRef);
  if (docSnap.exists()) {
    user.value = docSnap.data();
  } else {
    console.log("No such document!");
  }
});

const form = document.querySelector('form');
const title = ref('');
const questions = ref([]);
const question = ref('');
const submitError = ref('');
const surveyCreated = ref(false);

async function createQuestion() {
  try {
    // There's an array here for questions
    if (question.value.trim() === '') {
      console.error('Question cannot be empty');
      submitError.value = 'Question cannot be empty';
      return;
    }
    questions.value.push(question.value);
    console.log('Question added:', question.value);
    console.log('All questions:', questions.value);
  } catch (error) {
    console.error('Error creating question:', error);
    submitError.value = 'Error creating question. Please try again.';
  }
  
}

async function deleteQuestion(index) {
  try {
    // Remove the question from the array
    questions.value.splice(index, 1);
    console.log('Question deleted at index:', index);
    console.log('All questions:', questions.value);
  } catch (error) {
    console.error('Error deleting question:', error);
    submitError.value = 'Error deleting question. Please try again.';
  }
}

async function submitSurvey() {
  if (title.value.trim() === '' || questions.value.length === 0) {
    console.error('Survey title cannot be empty and be without questions');
    submitError.value = 'Survey title cannot be empty and at least one question is required';
    return;
  }
  try {
    submitError.value = '';
    const surveyRef = await addDoc(collection(db, 'surveys'), {
      createdAt: new Date(),
      createdBy: userCred.value.uid,
      title: title.value,
      responsesCount: 0,
      questions: questions.value,
    });
    console.log('Survey created with ID:', surveyRef.id);
    surveyCreated.value = true;
  } catch (error) {
    console.error('Error submitting survey:', error);
    submitError.value = 'Error submitting survey. Please try again.';
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
        <label for="surveyTitle" class="block text-sm font-large text-gray-700">Survey Title</label>
        <input type="text" id="surveyTitle" required v-model="title"
               placeholder="Enter survey title"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
      </div>
      <div class="mb-4" v-for="(q, index) in questions" :key="index">
        <p class="block text-sm font-large text-gray-700">{{ q }}</p>
        <button
          @click.prevent="deleteQuestion(index)"
          class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
          type="button">X</button>
      </div>
      <div class="mb-4">
        <input type="text" id="newQuestion" required v-model="question"
               placeholder="Enter a new question"
        class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
        <button
          @click.prevent="createQuestion"
          class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
          type="button">Add Question</button>
      </div>
      <!-- Restrict to submit survey without questions -->
      <div v-if="submitError" class="text-red-500 mb-4">
        {{ submitError }}
      </div>
      <button
        @click="submitSurvey"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
        type="submit">Create Survey</button>
    </form>
    <p v-if="surveyCreated" class="text-green-500">You created a survey!</p>
    <div class="mt-4">
      <RouterLink to="/surveys" class="text-blue-600 hover:underline">View All Surveys</RouterLink>
    </div>
  </div>
  <div v-else>
    <p class="bg-red-500 text-white p-2 rounded">You do not have permission to create surveys.</p>
  </div>
</template>