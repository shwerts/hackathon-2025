<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <RouterLink class="hover:underline" to="/login">Login</RouterLink>
    <RouterLink class="hover:underline" to="/register">Register</RouterLink>
  </nav>
  <RouterView />
</template>