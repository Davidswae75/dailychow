<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AnimatePresence, motion } from "motion-v";
import { ChevronRight, CookingPot } from "@lucide/vue";
import DishSearch from "./topbar/DishSearch.vue";
import TonightChip from "./topbar/TonightChip.vue";
import UserMenu from "./topbar/UserMenu.vue";
import { navItemFor, formatLongDate, getDishById } from "@/lib";

/**
 * Dashboard top bar. Left: where you are (section icon, breadcrumb and page title).
 * Right: search, tonight's pick and the account menu. It firms up once the page
 * scrolls under it so it reads as a separate layer.
 */
const route = useRoute();
const today = formatLongDate(new Date());

const section = computed(() => navItemFor(route.path));

/** Pages nested under a section get a specific title, with the section as a breadcrumb. */
const nestedTitle = computed(() => {
  if (route.path === "/dashboard/pick/result") return "Your pick";
  const dishId = route.path.match(/^\/dashboard\/foods\/([^/]+)/)?.[1];
  if (dishId) return getDishById(dishId)?.name ?? "Dish";
  return null;
});

const title = computed(() => nestedTitle.value ?? section.value?.name ?? "Daily Chow");
const crumb = computed(() => (nestedTitle.value ? section.value : null));

// The bar sits inside the layout's scroll container, not the window
const header = ref<HTMLElement | null>(null);
const scrolled = ref(false);
let scroller: HTMLElement | null = null;
const onScroll = () => (scrolled.value = (scroller?.scrollTop ?? 0) > 4);

onMounted(() => {
  scroller = header.value?.parentElement ?? null;
  scroller?.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => scroller?.removeEventListener("scroll", onScroll));
</script>

<template>
  <header
    ref="header"
    class="sticky top-0 z-30 flex h-[calc(4rem+env(safe-area-inset-top))] shrink-0 items-center gap-3 border-b px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 md:h-20 md:rounded-t-[40px] md:px-8"
    :class="
      scrolled
        ? 'border-border/80 bg-cream/85 shadow-[0_10px_30px_-18px_oklch(0.45_0.08_50/0.45)]'
        : 'border-transparent bg-cream/40'
    "
  >
    <!-- Where you are -->
    <div class="flex min-w-0 items-center gap-3">
      <RouterLink
        to="/dashboard/home"
        aria-label="Daily Chow home"
        class="grid size-10 shrink-0 place-items-center rounded-2xl bg-terracotta text-cream shadow-soft transition-transform active:scale-95 md:hidden"
      >
        <CookingPot class="size-5" />
      </RouterLink>
      <span
        class="hidden size-11 shrink-0 place-items-center rounded-2xl border border-border bg-paper text-terracotta-deep md:grid"
        aria-hidden="true"
      >
        <component :is="section?.icon ?? CookingPot" class="size-5" />
      </span>

      <div class="flex min-w-0 flex-col">
        <nav v-if="crumb" aria-label="Breadcrumb" class="flex items-center gap-1 text-xs text-ink">
          <!-- The page title below completes the trail, so only the parent is linked here -->
          <RouterLink :to="crumb.to" class="hover:text-terracotta-deep hover:underline">{{ crumb.name }}</RouterLink>
          <ChevronRight class="size-3 shrink-0" aria-hidden="true" />
        </nav>
        <span v-else class="truncate text-xs text-ink">{{ today }}</span>

        <AnimatePresence mode="wait" :initial="false">
          <motion.p
            :key="title"
            class="truncate font-display text-lg leading-tight font-bold text-charcoal md:text-xl"
            :initial="{ opacity: 0, y: 6 }"
            :animate="{ opacity: 1, y: 0 }"
            :exit="{ opacity: 0, y: -6 }"
            :transition="{ duration: 0.2 }"
          >
            {{ title }}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>

    <!-- Tools -->
    <div class="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
      <DishSearch />
      <TonightChip />
      <span class="hidden h-7 w-px bg-border md:block" aria-hidden="true" />
      <UserMenu />
    </div>
  </header>
</template>
