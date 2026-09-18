<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";
import {
  foodsByCategory,
  type FoodCategory,
  type FoodType,
} from "@/types/FoodTypes";
import { AnimatePresence, motion } from "motion-v";
import { ref } from "vue";

const model = defineModel<FoodType[]>({
  default: () => [],
});
const foodKeys = Object.keys(foodsByCategory) as FoodCategory[];

const category = ref<FoodCategory>("Rice");

const optionLength = (key: FoodCategory) => {
  return model.value.filter((l) => l.category == key).length;
};

const isSelected = (id: string, type: "object" | "string" = "string") =>
  type == "object" ? model.value.find((f) => f.id == id) : category.value == id;

const handleSelection = (item: FoodType) => {
  const food = isSelected(item.id, "object");
  if (food) model.value = model.value.filter((f) => f.id !== item.id);
  else model.value = [...model.value, item];
};
</script>

<template>
  <main class="space-y-3 py-3">
    <HeaderText
      eyebrow="Question 4 of 5"
      title="Category of food you eat the most"
      description="Helps us decide for you"
    />

    <section class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <Chip
          v-for="b in foodKeys"
          :key="b"
          :variant="isSelected(b) ? 'secondary' : 'primary'"
          :active="!!isSelected(b)"
          hover
          @click="category = b"
        >
          <div
            class="relative z-20 flex justify-between items-baseline-last gap-1.5"
          >
            {{ b }}
            <p
              :class="[!!isSelected(b) ? 'text-terracotta-deep bg-accent': 'text-terracotta-deep']"
              class="font-display font-bold p-0.5 px-1.5 rounded-full"
            >
              {{ optionLength(b) }}
            </p>
          </div>
        </Chip>
      </div>
      <p class="text-muted-foreground text-sm">More Specificity</p>
      <div mode="wait" class="transition-all">
        <motion.div
          :key="category"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 12 }"
          class="grid md:grid-cols-2 gap-3"
        >
          <Chip
            v-for="b in foodsByCategory[category]"
            :key="b.id"
            :variant="isSelected(b.id, 'object') ? 'secondary' : 'primary'"
            hover
            @click="handleSelection(b)"
          >
            <div class="relative z-20 space-y-2 p-4">
              <p class="font-bold text-sm">{{ b.name }}</p>
              <p class="text-xs">{{ b.description }}</p>
            </div>
          </Chip>
        </motion.div>
      </div>
    </section>
  </main>
</template>
