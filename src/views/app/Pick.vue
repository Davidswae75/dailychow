<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Sparkles } from "@lucide/vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import OptionGroup from "@/components/app/common/OptionGroup.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import { usePickStore } from "@/store";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { cookOptions, mealOptions, moodOptions, timeOptions, type RelaxedAnswer } from "@/lib";

const { answers, ranked, relaxed } = storeToRefs(usePickStore());
const router = useRouter();
const toast = useToast();

const relaxedLabel: Record<RelaxedAnswer, string> = {
  mood: "your mood",
  time: "your time",
  cook: "cook or buy",
  meal: "the meal",
};

function pick() {
  if (!ranked.value.length) {
    toast.error("Your no-go foods and pepper level rule out every dish. Loosen them in Preferences.");
    return;
  }
  if (relaxed.value.length) {
    toast.warning(`Nothing matched every answer, so we ignored ${relaxed.value.map((r) => relaxedLabel[r]).join(" and ")}.`);
  }
  router.push("/dashboard/pick/result");
}
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
      <OptionGroup v-model="answers.cook" label="Cook or buy?" :options="cookOptions" />
      <OptionGroup v-model="answers.mood" label="In the mood for" :options="moodOptions" />
    </SurfaceCard>

    <p class="-mt-2 text-center text-sm text-ink">
      <template v-if="!ranked.length">No dish fits your no-go foods and pepper level.</template>
      <template v-else-if="relaxed.length">No exact match. We'll pick the closest dish.</template>
      <template v-else>{{ ranked.length }} dish{{ ranked.length === 1 ? "" : "es" }} fit your answers</template>
    </p>

    <button
      type="button"
      @click="pick"
      class="flex h-13 items-center justify-center gap-2 rounded-full bg-terracotta-deep text-base font-bold text-paper transition-transform active:scale-[0.98]"
    >
      <Sparkles class="size-5" /> Pick tonight's dish
    </button>
  </main>
</template>
