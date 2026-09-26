<script setup lang="ts">
import { ref, computed, onMounted, provide } from "vue";
import OContainer from "@/components/site/OContainer.vue";
import WhatBringYouHere from "./WhatBringYouHere.vue";
import NotInterested from "./NotInterested.vue";
import BodyTypes from "./BodyTypes.vue";
import Register from "../auth/Register.vue";
import { ArrowLeft, ArrowRight } from "@lucide/vue";
import { AnimatePresence, motion } from "motion-v";
import { useForm } from "vee-validate";
import {
  registerSchema,
  type RegisterSchemaType,
  type UserProps,
} from "@/types";
import Favourites from "./Favourites.vue";
import { useRouter } from "vue-router";
import { useScreenSize } from "@/hooks/useScreenSize";
import { getError, initUser } from "@/firebase";
import { useUiStore } from "@/store";
import Button from "@/components/ui/button/Button.vue";

const currentStep = ref(1);
const totalSteps = 5;

const { handleSubmit, values, setFieldValue } = useForm<RegisterSchemaType>({
  validationSchema: registerSchema,
  initialValues: {
    fullName: "",
    email: "",
    password: "",
    interests: "eat_healthier",
    notInterested: {
      dietaryNeeds: ["vegetarian"],
      pepperLevel: "mild",
    },
    bodyType: {
      id: "lean_frame",
      name: "Lean Frame",
      category: "Lean",
    },
    favourites: [],
  },
});

const { smallerThan } = useScreenSize();
const loading = ref(false);
provide("loading", loading);
const router = useRouter();
const { alert } = useUiStore();

const submitForm = handleSubmit(async (formValues) => {
  loading.value = true;
  try {
    const payload: Omit<UserProps, "id" | "userID"> = {
      joinedDate: new Date(),
      dislikes: [],
      foodEaten: [],
      role: "user",
      ...formValues,
    };
    await initUser(payload);

    alert.success("Registered Successfully, Let's Chow");

    setTimeout(() => {
      router.push("/dashboard/home");
    }, 3000);
  } catch (error) {
    getError(error);
  } finally {
    loading.value = false;
  }
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

  isLowEndDevice.value = (isAndroid && cores <= 4) || memory <= 2 || cores <= 2;
});

// ---------- Animation variants ----------
const animation = computed(() => {
  if (prefersReducedMotion.value) {
    return {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 },
    };
  }

  if (isLowEndDevice.value) {
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.15, ease: "easeOut" },
    };
  }

  return {
    initial: { scale: 0.9, filter: "blur(20px)", opacity: 0 },
    animate: { scale: 1, filter: "blur(0px)", opacity: 1 },
    exit: { scale: 0.9, filter: "blur(20px)", opacity: 0 },
    transition: { duration: 0.6 },
  };
});

const goNext = () => {
  if (currentStep.value < totalSteps) currentStep.value++;
};

const goBack = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const updateField = <T extends keyof RegisterSchemaType>(
  key: T,
  val: RegisterSchemaType[T]
) => {
  setFieldValue(key as any, val);
};
</script>

<template>
  <main class="bg-cream grain">
    <!-- {{ values }} -->
    <section class="mx-auto max-w-2xl">
      <OContainer :current-step="currentStep" :steps="totalSteps">
        <template #content>
          <AnimatePresence mode="popLayout">
            <motion.div
              :key="currentStep"
              v-bind="animation"
              class="motion-step w-full"
            >
              <form @submit.prevent="submitForm">
                <WhatBringYouHere
                  v-if="currentStep === 1"
                  :modeValue="values.interests"
                  @update:model-value="(val) => updateField('interests', val)"
                />
                <NotInterested
                  v-else-if="currentStep === 2"
                  :modelValue="values.notInterested"
                  @update:model-value="
                    (val) => updateField('notInterested', val)
                  "
                />
                <BodyTypes
                  v-else-if="currentStep === 3"
                  :modelValue="values.bodyType"
                  @update:model-value="(val) => setFieldValue('bodyType', val)"
                />
                <Favourites
                  v-else-if="currentStep === 4"
                  :modelValue="values.favourites"
                  @update:model-value="
                    (val) => setFieldValue('favourites', val)
                  "
                />
                <Register
                  :modelValue="{
                    fullName: values.fullName,
                    email: values.email,
                    password: values.password,
                  }"
                  @update:model-value="
                    (val) => {
                      setFieldValue('fullName', val.fullName || 'Dave');
                      setFieldValue('email', val.email);
                      setFieldValue('password', val.password);
                    }
                  "
                  v-else-if="currentStep === 5"
                />
              </form>
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

            <Button
              v-else-if="smallerThan('md')"
              variant="terracotta"
              type="submit"
              :loading="loading"
              @click="submitForm"
            >
              Create Account
            </Button>
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
