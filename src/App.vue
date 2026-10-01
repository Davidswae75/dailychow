<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { computed } from "vue";
import Dashboard from "./layouts/Dashboard.vue";
import AlertBar from "./components/utils/AlertBar.vue";
import { AnimatePresence, motion } from "motion-v";

const layouts = {
  default: DefaultLayout,
  dashboard: Dashboard,
};
const route = useRoute();

const getLayout = computed(() => {
  const layoutName = route.meta.layout;
  return layouts[layoutName as keyof typeof layouts] || layouts["default"];
});
</script>

<template>
  <main>
    <AlertBar />
    <component :is="getLayout">
      <AnimatePresence mode="popLayout">
        <!-- <motion.div
          :key="$route.fullPath"
          :initial="{
            opacity: 0,
            scale: 0.9,
          }"
          :animate="{
            opacity: 1,
            scale: 1,
          }"
          :exit="{
            opacity: 0,
            scale: 0.9,
            transition: {
              duration: 0.5,
            },
          }"
          :transition="{
            ease: 'easeInOut',
            duration: 0.7,
          }"
        > -->
          <RouterView />
        <!-- </motion.div> -->
      </AnimatePresence>
    </component>
  </main>
</template>
