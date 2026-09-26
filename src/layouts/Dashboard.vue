<script setup lang="ts">
import { useAuth } from "@/hooks";
import { useAuthStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import foodgif from "@/assets/warming-food.gif";
import { AnimatePresence, motion } from "motion-v";

const authStore = useAuthStore();
const { isLoggedIn } = storeToRefs(authStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const { checkUser } = useAuth();

onMounted(() => {
  checkUser();
});
</script>

<template>
  <main class="relative">
    <AnimatePresence>
      <motion.section
        v-if="isLoggedIn"
        key="logged_in"
        :initial="{ opacity: 1, filter: 'blur(0px)' }"
        :exit="{
          opacity: 0,
          filter: 'blur(1px)',
          transition: { duration: 0.35, ease: 'easeInOut' },
        }"
        :transition="{ duration: 0.5 }"
        class="min-h-screen bg-terracotta flex justify-center items-center"
      >
        <div>
          <img
            :src="foodgif"
            alt="food-warming"
            class="object-fit aspect-auto size-32 mx-auto animate-steam"
          />
          <p class="font-display font-bold text-cream animate-simmer">
            Cooking Your Dashboard...
          </p>
        </div>
      </motion.section>
    </AnimatePresence>

    <div v-if="isLoggedIn">
      <slot />
    </div>
  </main>
</template>
