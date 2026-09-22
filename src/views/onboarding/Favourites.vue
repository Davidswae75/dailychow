<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Button from "@/components/ui/button/Button.vue";
import { CheckCircle } from "@lucide/vue";
import { computed, ref } from "vue";
import VLazyImage from "v-lazy-image"
import { dishes, type Dish } from "@/lib/dishes";

const model = defineModel<Dish[]>({
  default: () => [],
});

const isSelected = (id: string) => {
  return model.value.find((m) => m.id == id);
};

const handleSelection = (item: Dish) => {
  const findID = model.value.find((m) => m.id === item.id);

  if (findID) model.value = model.value.filter((m) => m.id != item.id);
  else model.value = [...model.value, item];
};

const visibleItems = ref(9);
const moreItems = computed(() => dishes.length - visibleItems.value);
</script>

<template>
  <main class="space-y-3 p-1">
    <HeaderText
      eyebrow="Quetion 5 of 5"
      title="Pick a few old favourites"
    >
    <template #description>
     <div class="flex justify-between items-center flex-wrap">
      <p class="text-muted-foreground text-sm">
        Tap any you love — we'll keep them in the rotation.
      </p>
      <p class="text-terracotta font-bold font-display"> ~ {{ model.length }}</p>
     </div>
    </template>
  </HeaderText>

    <section class="grid grid-cols-3 gap-3">
      <div
        @click="handleSelection(f)"
        :class="!!isSelected(f.id) && 'border-2 border-terracotta'"
        class="h-32 transition-all md:h-60 w-full rounded-3xl overflow-hidden relative"
        v-for="f in dishes.slice(0, visibleItems)"
        :key="f.id"
      >
        <div
          class="bg-linear-to-t from-charcoal/50 to-charcoal/0 z-10 absolute inset-0 top-0"
        ></div>
        <CheckCircle
          v-show="!!isSelected(f.id)"
          class="absolute top-3 right-3 bg-terracotta rounded-full p-1 size-5 md:size-6 z-50 text-cream"
        />
        <v-lazy-image
          :src="f.img"
          class="object-cover h-full w-full absolute inset-0"
        />
        <p class="p-2 text-xs md:font-medium text-cream z-50 absolute bottom-0">
          {{ f.name }}
        </p>
      </div>
    </section>
    <Button
      v-if="visibleItems < dishes.length"
      @click="visibleItems += 9"
      block="full"
      size="xl"
      type="button"
      variant="accent"
      >Show More <span class="font-bold">({{ moreItems }})</span></Button
    >
  </main>
</template>

