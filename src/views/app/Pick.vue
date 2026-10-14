<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Sparkles } from "@lucide/vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import OptionGroup from "@/components/app/common/OptionGroup.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import { usePickStore } from "@/store";
import { budgetOptions, cookOptions, mealOptions, moodOptions, timeOptions } from "@/lib/options";

const { answers } = storeToRefs(usePickStore());
</script>

<template>
  <main class="mx-auto flex max-w-2xl flex-col gap-6 px-5 py-6 pb-32 md:px-8 md:pb-10">
    <PageHeader
      title="What's tonight like?"
      description="A few quick taps. Your no-go foods and pepper level are already set."
    />

    <SurfaceCard class="flex flex-col gap-6">
      <OptionGroup v-model="answers.meal" label="Which meal?" :options="mealOptions" />
      <OptionGroup v-model="answers.time" label="How much time do you have?" :options="timeOptions" />
      <OptionGroup v-model="answers.budget" label="What's in your pocket?" :options="budgetOptions" />
      <OptionGroup v-model="answers.cook" label="Cook or buy?" :options="cookOptions" />
      <OptionGroup v-model="answers.mood" label="In the mood for" :options="moodOptions" />
    </SurfaceCard>

    <RouterLink
      to="/dashboard/pick/result"
      class="flex h-13 items-center justify-center gap-2 rounded-full bg-terracotta-deep text-base font-bold text-paper transition-transform active:scale-[0.98]"
    >
      <Sparkles class="size-5" /> Pick tonight's dish
    </RouterLink>
  </main>
</template>
