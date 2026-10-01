<script setup lang="ts">
import { Bell, Search } from "@lucide/vue";
import Logo from "../site/Logo.vue";
import Button from "../ui/button/Button.vue";
</script>

<template>
  <header
    class="h-14 sticky top-0 z-50 bg-cream flex items-center grain border border-border p-5 pr-6 md:p-8"
  >
    <div class="flex items-center gap-3 justify-center w-full">
      <Logo name="" bg size="md" />
      <Button variant="outline" class="inline-flex text-olive"><Search/> Search Foods...</Button>

      <div class="w-full">
        <Bell class="float-end text-olive"/>
      </div>
    </div>
  </header>
</template>
