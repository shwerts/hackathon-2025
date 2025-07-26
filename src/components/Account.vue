<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
import { auth, db } from '@/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref } from 'vue';


defineProps({
  userName: {
    type: String,
    default: 'NO NAME'
  }
});

const logout = async () => {
  try {
    await signOut(auth);
    router.push('/'); // Redirect to home after logout
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

async function changeName() {
  if (!newName.value.trim()) {
    console.error('Name cannot be empty');
    return;
  }
  // Placeholder for name change logic
  console.log('Change name function called');

  updateProfile(auth.currentUser, {
    displayName: newName.value
  }).then(() => {
    console.log('Name updated successfully');
  }).catch((error) => {
    console.error('Error updating name:', error);
  });
  await auth.currentUser.reload();

  await setDoc(doc(db, 'users', auth.currentUser.uid), {
    displayName: newName.value
  }, { merge: true }).then(() => {
    console.log('User name updated in Firestore');
  }).catch((error) => {
    console.error('Error updating user name in Firestore:', error);
  });
}
const newName = ref('');
</script>

<template>
  <div class="grid grid-cols-4 gap-8">
    <!-- Sidebar -->
    <aside class="col-span-1 flex flex-col gap-4">
      <div class="flex flex-col gap-2 bg-blue-100 rounded-lg p-4">
        <span class="font-semibold flex items-center gap-2">
          <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87"></path><path d="M9 20H4v-2a4 4 0 0 1 3-3.87"></path><circle cx="12" cy="7" r="4"></circle></svg>
          My groups
        </span>
        <button class="flex items-center gap-2 text-blue-700 hover:underline">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
          Click to add a group
        </button>
      </div>
      <!-- <div class="bg-blue-100 rounded-lg p-4">
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"></path><path d="M6.62 10.79A7.963 7.963 0 0 0 4 12c0 4.42 3.58 8 8 8s8-3.58 8-8c0-1.21-.27-2.36-.76-3.38"></path></svg>
          Status Account: Free
        </span>
        <a href="#" class="text-blue-700 underline">[Activate Premium]</a>
      </div> -->
      <button
        @click="logout"
        class="bg-red-100 rounded-lg p-4">Logout</button>
    </aside>
    <!-- Main Profile -->
    <section class="col-span-3 flex flex-col items-center gap-6">
      <img src="/src/assets/user_pic.png" alt="Avatar" class="rounded-full w-28 h-28 object-cover">
      <!-- <div class="flex flex-col items-center">
        <button class="bg-blue-200 text-blue-700 px-3 py-1 rounded flex items-center gap-1 text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 16v-4m0 0V8m0 4h4m-4 0H8"></path></svg>
          DOWNLOAD
        </button>
      </div> -->
      <p class="text-gray-600 text-xl">Welcome, <span id="user-name" class="font-semibold">{{ userName }}</span></p>
      <form
        class="w-full max-w-lg flex flex-col gap-4"
        @submit.prevent>
        <div class="flex items-center gap-2 bg-gray-300 rounded px-4 py-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>
          <input type="text" placeholder="Your new name" required v-model="newName"
            class="bg-transparent w-full outline-none">
        </div>
        <button
          class="bg-blue-400 text-white font-semibold rounded px-6 py-2 mt-4 self-end"
          type="submit"
          @click="changeName">EDIT</button>
      </form>
    </section>
  </div>
</template>