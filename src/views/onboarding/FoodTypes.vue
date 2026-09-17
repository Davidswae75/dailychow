<script setup lang="ts">
import HeaderText from '@/components/landing/HeaderText.vue';
import Chip from '@/components/utils/chip.vue';
import { foodsByCategory, type FoodCategory, type FoodType } from '@/types/FoodTypes';
import { AnimatePresence, motion } from 'motion-v';

const model = defineModel<FoodType>({
    default: () => ({
        category: 'Rice',
        id: '',
        name: '',
        description: '',
    })
})
const foodKeys = Object.keys(foodsByCategory) as FoodCategory[]

</script>


<template>
    <main class="space-y-3">
        <HeaderText eyebrow="Question 4 of 5" title="Category of food you eat the most" description="Helps us decide for you"/>

        <section class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <Chip
          v-for="b in foodKeys"
          :key="b"
          :variant="model.category == b ? 'secondary' : 'primary'"
          hover
          @click="model.category = b"
        >
          <span class="relative z-20">{{ b }}</span>
        </Chip>
      </div>
      <p class="text-muted-foreground text-sm">More Specificity</p>
      <AnimatePresence mode="wait" class="grid md:grid-cols-2 gap-2 transition-all">
        <motion.div
          :key="model.category"
          :initial="{ opacity: 0, y: 12 }"
          :animate="{ opacity: 1, y: 0 }"
          :exit="{ opacity: 0, y: 12 }"
          :transition="{
            ease: 'easeInOut'
          }"
        >
          <Chip
            v-for="b in foodsByCategory[model.category]"
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