<script setup lang="ts">
import { Search, X } from "@lucide/vue";

/** Plain search box; not a form field, so it skips vee-validate and follows v-model both ways. */
const model = defineModel<string>({ default: "" });
</script>

<template>
  <div class="relative w-full">
    <input
      v-model="model"
      type="search"
      name="foodSearch"
      placeholder="Search Food..."
      class="h-12 w-full rounded-full border border-line bg-paper px-5 pr-14 text-base text-charcoal caret-terracotta outline-0 transition-all placeholder:text-sm placeholder:text-muted-foreground focus:border-none focus:ring focus:ring-terracotta [&::-webkit-search-cancel-button]:hidden"
    />
    <div class="absolute top-3 right-6">
      <Search v-if="!model" class="text-muted-foreground" />
      <button v-else type="button" aria-label="Clear search" @click="model = ''">
        <X class="text-muted-foreground" />
      </button>
    </div>
  </div>
</template>
