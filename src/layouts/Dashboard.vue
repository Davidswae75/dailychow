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
  <main
    class="relative grid md:grid-cols-[100px_calc(100%-100px)] lg:grid-cols-[300px_calc(100%-300px)] bg-cream md:p-3 transition-all"
  >
    <section
      class="min-h-[calc(100vh-300px)] bg-cream text-terracotta hidden md:block"
    >
      <div class="fixed md:w-[100px] lg:w-[300px] p-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam dolorem
        ratione consequatur inventore ab vitae ipsum suscipit quaerat, earum
        odit corporis vel? Quaerat animi beatae maiores numquam repudiandae
        doloremque quae asperiores. Totam sapiente harum suscipit laborum
        voluptatibus veritatis atque iure magnam, commodi optio nisi? Quos rem
        ea veniam eum harum?
      </div>
    </section>
    <div
      class="min-h-screen md:min-h-0 md:h-[calc(100vh-23px)] self-center bg-terracotta md:rounded-[40px] overflow-scroll shadow-terracotta-deep shadow-2xl"
    >
      <AnimatePresence>
        <motion.section
          v-if="!isLoggedIn"
          key="logging-in"
          :initial="{ opacity: 1 }"
          :exit="{
            opacity: 0,
            filter: 'blur(1px)',
            transition: { duration: 0.4, ease: 'easeInOut' },
          }"
          :transition="{ duration: 0.5 }"
          class="h-screen bg-terracotta flex justify-center items-center"
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

        <motion.div
          v-else
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
          :transition="{ duration: 1 }"
        >
         <div >
        <slot />
      </div>  
      </motion.div>
      </AnimatePresence>
     
    </div>
  </main>
</template>
