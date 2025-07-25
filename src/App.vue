<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <img src="./assets/777.jpg" alt="EduPulse Logo" class="h-8 w-auto">
        <span class="text-xl font-bold text-blue-600">EduAnalytics</span>
      </div>
      <nav class="flex gap-6 font-medium text-gray-700">
        <RouterLink to="/" class="hover:text-blue-600 transition">Main page</RouterLink>
        <RouterLink to="/surveys" class="hover:text-blue-600 transition">Surveys</RouterLink>
        <RouterLink to="/account" class="hover:text-blue-600 transition">Account</RouterLink>
      </nav>
    </div>
  </header>

  <main class="p-6 max-w-screen-xl mx-auto">
    <RouterView />
  </main>
</template>