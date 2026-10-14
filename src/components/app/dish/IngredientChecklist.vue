<script setup lang="ts">
import { computed } from "vue";
import { Check } from "@lucide/vue";

/** Ingredients as tick boxes; ticked = "I already have this". */
const props = defineProps<{ ingredients: string[] }>();
const have = defineModel<string[]>({ default: () => [] });

const toBuy = computed(() => props.ingredients.length - have.value.length);

function toggle(item: string) {
  have.value = have.value.includes(item) ? have.value.filter((i) => i !== item) : [...have.value, item];
}
</script>

<template>
  <section aria-labelledby="need-title" class="space-y-2.5">
    <div class="flex items-baseline justify-between gap-3">
      <h2 id="need-title" class="text-xl font-bold">What you need</h2>
      <span class="text-sm text-ink">Tick what you have · {{ toBuy }} to buy</span>
    </div>
    <ul class="grid grid-cols-2 gap-1.5">
      <li v-for="item in ingredients" :key="item">
        <button
          type="button"
          :aria-pressed="have.includes(item)"
          class="flex min-h-10 w-full items-center gap-2 rounded-xl border border-border bg-paper px-2.5 py-1.5 text-left text-sm transition-colors hover:border-olive/50"
          @click="toggle(item)"
        >
          <span
            class="grid size-[18px] shrink-0 place-items-center rounded-md border transition-colors"
            :class="have.includes(item) ? 'border-olive bg-olive text-paper' : 'border-ink'"
          >
            <Check v-if="have.includes(item)" class="size-3" stroke-width="3" />
          </span>
          <span class="capitalize" :class="have.includes(item) && 'text-ink line-through'">{{ item }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>
