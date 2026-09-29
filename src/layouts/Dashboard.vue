<script setup lang="ts">
import { useAuth } from "@/hooks";
import { useAuthStore, useUserStore } from "@/store";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import foodgif from "@/assets/warming-food.gif";
import { AnimatePresence, motion } from "motion-v";
import LoadingScreen from "@/components/utils/LoadingScreen.vue";
import Sidebar from "@/components/site/Sidebar.vue";

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
    class="relative grid md:grid-cols-[100px_calc(100%-100px)] lg:grid-cols-[300px_calc(100%-300px)] bg-paper md:py-3 md:pr-3 transition-all grain"
  >
    <section
      class="bg-inherit text-cream hidden md:block"
    >
     <Sidebar/>
    </section>


    <section
      class="min-h-screen md:min-h-0 md:h-[calc(100vh-23px)] self-center bg-cream md:rounded-[40px] overflow-scroll shadow-terracotta-deep grain"
    >
      <main>
        <LoadingScreen :state="!isLoggedIn"/>

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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              perferendis reprehenderit hic delectus eos maxime eveniet
              consequuntur, a debitis voluptas iure, optio laborum quisquam
              autem animi nihil beatae numquam, quia magni perspiciatis nulla
              nam consectetur? Nesciunt alias eligendi suscipit adipisci
              aliquid, nemo itaque repellat illo praesentium! Magni, commodi
              illo. Voluptatum ex perferendis nulla reprehenderit, ducimus,
              molestiae modi quo accusantium laborum alias dolorem consequuntur
              ipsum quidem, voluptas rerum odit assumenda. Debitis, possimus.
              Magni qui cupiditate consequuntur quae fuga nulla aut fugit
              voluptatum voluptates, error architecto incidunt, debitis
              reprehenderit aspernatur ex commodi, molestiae dolorum illo
              voluptatibus? Ipsam, sapiente aperiam. Aliquid, suscipit ipsum?
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </section>
  </main>
</template>
