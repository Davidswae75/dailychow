<script setup lang="ts">
import { useAuthStore } from "@/store";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AnimatePresence, motion } from "motion-v";
import Sidebar from "@/components/site/Sidebar.vue";
import Bottombar from "@/components/site/Bottombar.vue";
import NavBar from "@/components/app/NavBar.vue";

const authStore = useAuthStore();
const { isLoggedIn, pending } = storeToRefs(authStore);
const router = useRouter();
const route = useRoute();

// The router guard handles navigation; this covers the session ending while on a page
watch([isLoggedIn, pending], ([loggedIn, loading]) => {
  if (!loading && !loggedIn) router.replace({ path: "/sign-in", query: { redirect: route.fullPath } });
});
</script>

<template>
  <main
    class="relative grid md:grid-cols-[100px_calc(100%-100px)] lg:grid-cols-[300px_calc(100%-300px)] bg-paper md:py-3 md:pr-3 transition-all grain"
  >
    <section class="bg-inherit text-cream hidden md:block">
      <Sidebar />
    </section>

    <section
      class="h-screen min-h-screen relative md:min-h-0 md:h-[calc(100vh-23px)] self-center bg-cream md:rounded-[40px] flex flex-col shadow-terracotta-deep grain overflow-scroll"
    >
      <NavBar />


      <AnimatePresence>
        <motion.div
          v-if="isLoggedIn"
          key="logged_in"
          :initial="{ opacity: 1, filter: 'blur(10px)' }"
          :animate="{
            filter: 'blur(0px)',
            opacity: 1,
          }"
          :exit="{
            opacity: 0,
            filter: 'blur(1px)',
            transition: { duration: 0.4, ease: 'easeInOut' },
          }"
          :transition="{ duration: 1.3 }"
        >
          <div>
            <slot />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
    <Bottombar />
  </main>
</template>
