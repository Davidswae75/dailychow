<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import OContainer from "@/components/site/OContainer.vue";
import WhatBringYouHere from "./WhatBringYouHere.vue";
import NotInterested from "./NotInterested.vue";
import BodyTypes from "./BodyTypes.vue";
import FoodTypes from "./FoodTypes.vue";
import Register from "../auth/Register.vue";
import Button from "@/components/ui/button/Button.vue";
import { ArrowLeft, ArrowRight } from "@lucide/vue";
import { AnimatePresence, motion } from "motion-v";
import type { BodyType } from "@/types";
import type { FoodType } from "@/types/FoodTypes";
import Favourites from "./Favourites.vue";

const currentStep = ref(1);
const totalSteps = 5;

const profilePreference = reactive({
  interests: "eat_healthier",
  notInterested: {
    dietaryNeeds: ["vegetarian"],
    pepperLevel: "mild",
  },
  bodyType: {
    id: "lean_frame",
    name: "Lean Frame",
    category: "Lean",
  } as BodyType,
  foodType: [
    {
      id: "jollof-rice",
      name: "Jollof Rice",
      category: "Rice",
      description: "Classic party rice in tomato-pepper sauce",
    },
  ] as FoodType[],
});

// ---------- Device detection ----------
const isLowEndDevice = ref(false);
const prefersReducedMotion = ref(false);

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const isAndroid = /Android/i.test(navigator.userAgent);

  // Low-end = Android with weak hardware
  isLowEndDevice.value = (isAndroid && cores <= 4) || memory <= 2 || cores <= 2;
});

// ---------- Animation variants ----------
const animation = computed(() => {
  // No animation
  if (prefersReducedMotion.value) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  // Light animation for low-end Android
  if (isLowEndDevice.value) {
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    };
  }

  // Full animation (with blur) for iPhone & high-end devices
  return {
    initial: { scale: 0.9, filter: "blur(20px)", opacity: 0 },
    animate: { scale: 1, filter: "blur(0px)", opacity: 1 },
    exit: { scale: 0.9, filter: "blur(20px)", opacity: 0 },
    transition: {
      duration: 0.5,
    },
  };
});

const goNext = () => {
  if (currentStep.value < totalSteps) currentStep.value++;
};

const goBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};
</script>

<template>
  <main class="bg-cream grain">
    <section class="mx-auto max-w-2xl">
      <OContainer :current-step="currentStep" :steps="totalSteps">
        <template #content>
          <AnimatePresence mode="popLayout">
            <motion.div
              :key="currentStep"
              v-bind="animation"
              class="motion-step w-full"
            >
              <WhatBringYouHere
                v-if="currentStep === 1"
                v-model="profilePreference.interests"
              />
              <NotInterested
                v-else-if="currentStep === 2"
                v-model="profilePreference.notInterested"
              />
              <BodyTypes
                v-else-if="currentStep === 3"
                v-model="profilePreference.bodyType"
              />
              <FoodTypes
                v-else-if="currentStep === 4"
                v-model="profilePreference.foodType"
              />
              <Register v-else-if="currentStep === 5" />
            </motion.div>
          </AnimatePresence>
        </template>

        <template #footer>
          <div
            class="sticky bottom-0 z-30 flex items-center justify-between bg-cream grain py-4"
          >
            <Button
              v-if="currentStep > 1"
              variant="link"
              class="flex items-center gap-1"
              @click="goBack"
            >
              <ArrowLeft class="size-4" />
              Back
            </Button>
            <div v-else />

            <Button
              v-if="currentStep < totalSteps"
              variant="terracotta"
              class="flex items-center gap-1"
              @click="goNext"
            >
              Continue
              <ArrowRight class="size-4" />
            </Button>
            <div v-else />
          </div>
        </template>
      </OContainer>
    </section>
  </main>
</template>

<style scoped>
.motion-step {
  will-change: transform, opacity, filter;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
