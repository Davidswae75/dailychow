<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { ArrowLeft, ChevronLeft, ChevronRight } from "@lucide/vue";
import type { Dish } from "@/lib";
import Shade from "@/components/utils/Shade.vue";

/**
 * Swipeable strip of dish photos. The next photo peeks in from the right so it's
 * clear there are more matches; dots and arrows show where you are.
 */
const props = defineProps<{ dishes: Dish[]; backTo: string; backLabel: string }>();
const index = defineModel<number>({ required: true });

const track = ref<HTMLElement>();
let fromScroll = false;
let scrollTimer: ReturnType<typeof setTimeout> | undefined;

function scrollToIndex(i: number, behavior: ScrollBehavior = "smooth") {
  const slide = track.value?.children[i] as HTMLElement | undefined;
  if (slide && track.value) track.value.scrollTo({ left: slide.offsetLeft - track.value.offsetLeft, behavior });
}

/** Picks the slide nearest the left edge once the swipe settles. */
function onScroll() {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    const el = track.value;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < Math.abs(slides[nearest].offsetLeft - el.offsetLeft - el.scrollLeft)) nearest = i;
    });
    if (nearest !== index.value) {
      fromScroll = true;
      index.value = nearest;
    }
  }, 80);
}

watch(index, (i) => {
  if (fromScroll) fromScroll = false;
  else scrollToIndex(i);
});
watch(() => props.dishes.map((d) => d.id).join(), () => nextTick(() => scrollToIndex(index.value, "instant")));
onMounted(() => scrollToIndex(index.value, "instant"));

const go = (step: number) => (index.value = (index.value + step + props.dishes.length) % props.dishes.length);
</script>

<template>
  <div class="relative h-80 overflow-hidden bg-charcoal md:h-full md:min-h-[28rem] md:rounded-[34px]">
    <div
      ref="track"
      class="no-scrollbar flex size-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain"
      :aria-label="`${dishes.length} matching dishes, swipe to see them`"
      @scroll.passive="onScroll"
    >
      <div
        v-for="(dish, i) in dishes"
        :key="dish.id"
        class="relative h-full shrink-0 snap-start snap-always overflow-hidden"
        :class="dishes.length > 1 ? 'w-[86%] md:w-[88%]' : 'w-full'"
      >
        <img
          :src="dish.img"
          :alt="dish.name"
          :loading="Math.abs(i - index) <= 1 ? 'eager' : 'lazy'"
          class="size-full object-cover transition-[filter,opacity] duration-300"
          :class="i === index ? '' : 'opacity-70 brightness-75'"
          draggable="false"
        />
        <!-- Name cap on the peeking photos so the next option reads at a glance -->
        <span
          class="absolute bottom-10 left-3 max-w-[80%] truncate rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-charcoal"
        >
          {{ dish.name }}
        </span>
      </div>
    </div>

    <Shade from="full" :strength="0.15" class="pointer-events-none" />

    <RouterLink
      :to="backTo"
      :aria-label="backLabel"
      class="absolute top-4 left-4 grid size-11 place-items-center rounded-full bg-paper text-charcoal shadow-soft transition-transform active:scale-95"
    >
      <ArrowLeft class="size-5" />
    </RouterLink>
    <div class="absolute top-4 right-4 flex items-center gap-2">
      <slot name="actions" />
      <span class="rounded-full bg-saffron px-3 py-1.5 text-xs font-semibold text-charcoal capitalize">
        {{ dishes[index]?.category }}
      </span>
    </div>

    <template v-if="dishes.length > 1">
      <!-- "More to see" cap -->
      <div
        class="pointer-events-none absolute right-3 bottom-12 flex items-center gap-1 rounded-full bg-charcoal/70 px-3 py-1.5 text-xs font-semibold text-paper backdrop-blur-sm md:bottom-6"
      >
        {{ index + 1 }} of {{ dishes.length }}
        <svg viewBox="0 0 24 12" class="h-3 w-6 animate-[nudge_1.4s_ease-in-out_infinite]" aria-hidden="true">
          <path d="M2 6h18M15 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <div class="absolute inset-x-0 bottom-12 flex justify-center gap-1.5 md:bottom-6 transition-all" aria-hidden="true">
        <span
          v-for="(dish, i) in dishes.slice(0, 8)"
          :key="dish.id"
          class="h-1 rounded-full bg-paper transition-all"
          :class="i === index ? 'w-5' : 'w-1 opacity-50'"
        />
      </div>

      <button
        type="button"
        aria-label="Previous dish"
        class="absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-charcoal shadow-soft md:grid"
        @click="go(-1)"
      >
        <ChevronLeft class="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next dish"
        class="absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-charcoal shadow-soft md:grid"
        @click="go(1)"
      >
        <ChevronRight class="size-5" />
      </button>
    </template>
  </div>
</template>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
@keyframes nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(4px); }
}
</style>
