<script setup lang="ts">
import SideNav from "./components/SideNav.vue";
</script>

<template>
  <main class="flex gap-6 p-6 min-h-screen w-full">
    <nav class="relative">
      <SideNav />
    </nav>
    <div class="flex-1">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
/* Additional page-level styles if needed */
</style>
