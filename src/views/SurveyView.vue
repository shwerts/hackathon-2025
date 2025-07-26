<script setup>
import { useRoute } from 'vue-router'
import TheSurvey from '../components/TheSurvey.vue'

const route = useRoute()
const surveyId = route.params.id;
</script>

<template>
  <TheSurvey :id="surveyId" />
</template>