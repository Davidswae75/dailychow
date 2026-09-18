<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";
import {
  bodyTypes,
  bodyTypesByCategory,
  type BodyType,
  type BodyTypesByCategory,
} from "@/types";
import { AnimatePresence, motion } from "motion-v";

const bodyTypeskeys = Object.keys(bodyTypesByCategory) as BodyTypesByCategory[];

const model = defineModel<BodyType>({
  default: () => ({
    category: "Lean",
    description: "",
    id: "",
    name: "",
  }),
});
</script>

<template>
  <main class="space-y-3">
    <HeaderText
      eyebrow="Question 3 of 5"
      title="Tell Us Your Body Type"
      description="Make we help your life"
    />

    <section class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <Chip
          v-for="b in bodyTypeskeys"
          :key="b"
          :variant="model.category == b ? 'secondary' : 'primary'"
          hover
          @click="model.category = b"
        >
          <span class="relative z-20">{{ b }}</span>
        </Chip>
      </div>
      <p class="text-muted-foreground text-sm">More Specificity</p>
      <AnimatePresence mode="wait" class="grid md:grid-cols-2 gap-2">
        <motion.div
          :key="model.category"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
        >
          <Chip
            v-for="b in bodyTypesByCategory[model.category]"
            :key="b.id"
            variant="primary"
            hover
            :active="model.id == b.id"
            @click="model = { ...b }"
          >
            <div class="relative z-20 space-y-2 p-4">
                <p class="font-bold text-sm">{{ b.name }}</p>
                <p class="text-xs">{{ b.description }}</p>
            </div>
          </Chip>
        </motion.div>
      </AnimatePresence>
    </section>
  </main>
</template>
