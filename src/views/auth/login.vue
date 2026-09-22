<script setup lang="ts">
import AuthForm from '@/components/site/Auth/AuthForm.vue';
import { ref } from 'vue';
const count = ref(0)

console.log(count.value)

</script>


<template>
  <main class="min-h-screen bg-cream grain border flex items-center" @click="count++">
   <section class="w-full sm:w-2/3 lg:w-1/3 mx-auto px-5 md:px-8">
    <AuthForm mode="login"/>
   </section>
  </main>
</template>