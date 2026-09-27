<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { h } from "vue";
import { useToast } from "vue-toastification";

const { success, info } = useToast();

// const myJSX = (
//     <div>
//         <h1>My Title</h1>
//         <span>My text</span>
//     </div>
// );

</script>

<template>
  <main>
    <p>This is the home dashboard page</p>
    <Button variant="accent" @click="success('Successful')"
      >Show Alert</Button
    >
  </main>
</template>
