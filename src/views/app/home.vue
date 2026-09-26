<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { useUiStore } from "@/store";

const { alert } = useUiStore();
</script>

<template>
  <main>
    <p>This is the home dashboard page</p>
    <Button variant="accent" @click="alert.success('Showing alert')"
      >Show Alert</Button
    >
  </main>
</template>
