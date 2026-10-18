<script setup lang="ts">
import { Plus } from "@lucide/vue";
import type { Dish } from "@/lib";
import DishThumb from "../dish/DishThumb.vue";

/**
 * One meal slot: label, dish (or an empty "add" state) and a trailing slot for
 * status or actions. Emits `add` when the empty state is tapped.
 */
defineProps<{
  label: string;
  dish?: Dish | null;
  /** Second line under the dish name */
  meta?: string;
  emptyText?: string;
}>();
defineEmits<{ add: [] }>();
</script>

<template>
  <div
    v-if="dish"
    class="flex items-center gap-3 rounded-[20px] border border-border bg-paper p-2.5"
  >
    <RouterLink :to="`/dashboard/foods/${dish.id}`" class="shrink-0 rounded-2xl" tabindex="-1">
      <DishThumb :dish="dish" class="size-12" />
    </RouterLink>
    <div class="flex min-w-0 grow flex-col">
      <span class="text-xs font-semibold text-ink">{{ label }}</span>
      <RouterLink :to="`/dashboard/foods/${dish.id}`" class="truncate text-[15px] font-semibold hover:underline">
        {{ dish.name }}
      </RouterLink>
      <span v-if="meta" class="text-xs text-ink">{{ meta }}</span>
    </div>
    <slot name="trailing" />
  </div>

  <button
    v-else
    type="button"
    class="flex w-full items-center gap-3 rounded-[20px] border border-dashed border-ink/60 p-2.5 text-left transition-colors hover:border-terracotta-deep hover:bg-paper/60"
    @click="$emit('add')"
  >
    <span class="grid size-12 shrink-0 place-items-center rounded-2xl bg-muted text-ink">
      <Plus class="size-5" />
    </span>
    <span class="flex grow flex-col">
      <span class="text-xs font-semibold text-ink">{{ label }}</span>
      <span class="text-[15px] font-semibold">{{ emptyText ?? "Nothing planned" }}</span>
    </span>
    <span class="text-sm font-semibold text-terracotta-deep">Add</span>
  </button>
</template>
