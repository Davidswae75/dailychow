<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { computed } from "vue";
import { checkingAuth } from "./router";
import LoadingScreen from "./components/utils/LoadingScreen.vue";
import Dashboard from "./layouts/Dashboard.vue";
import { AnimatePresence, MotionConfig, motion } from "motion-v";

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
  <!-- reducedMotion="user": follows the device's "reduce motion" setting -->
  <MotionConfig reduced-motion="user">
    <main>
      <LoadingScreen :state="checkingAuth" />
      <component :is="getLayout">
        <RouterView v-slot="{ Component, route: current }">
          <AnimatePresence mode="popLayout">
            <motion.div
              :key="current.path"
              :initial="{ opacity: 0, y: 12 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: -8, transition: { duration: 0 } }"
              :transition="{ duration: 0, ease: [0.21, 0.92, 0.25, 1] }"
            >
              <component :is="Component" />
            </motion.div>
          </AnimatePresence>
        </RouterView>
      </component>
    </main>
  </MotionConfig>
</template>
