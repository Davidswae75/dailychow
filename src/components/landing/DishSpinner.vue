<script setup lang="ts">
/**
 * The chop wheel: a guest-facing taste of the pick engine. Guests set the vibe,
 * the serving tray spins, and it lands on a dish that `matchDishes` says fits.
 * No account or history, so the taste profile is built from the slip alone.
 */
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { AnimatePresence, motion } from "motion-v";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "reka-ui";
import { Clock, MapPin, RotateCw, Sparkles, X } from "@lucide/vue";
import { Button } from "../ui/button";
import PepperMeter from "../app/dish/PepperMeter.vue";
import { useAuthStore } from "@/store";
import {
  cookOptions,
  currentMealSlot,
  formatMinutes,
  formatPriceShort,
  matchDishes,
  mealOptions,
  moodOptions,
  pepperOptions,
  timeOptions,
  whyText,
  type Option,
  type PickAnswers,
  type Recommendation,
  type RelaxedAnswer,
} from "@/lib";

const SLOTS = 8;
const SPIN_MS = 4600;
const STEP = 360 / SLOTS;

const route = useRoute();
const { isLoggedIn } = storeToRefs(useAuthStore());
// Signed-in people have the real Pick; sign-in and registration need the screen to themselves
const showLauncher = computed(() => !isLoggedIn.value && !route.meta.guestOnly);

const open = ref(false);
watch(() => route.path, () => (open.value = false));

const answers = reactive<PickAnswers>({
  meal: currentMealSlot(),
  time: "45",
  budget: "1000-3000",
  cook: "either",
  mood: "comfort",
});
const pepper = ref("medium");
const noGos = ref<string[]>([]);

const noGoOptions: Option[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "No seafood", value: "no_seafood" },
  { label: "No peanuts", value: "peanut_allergy" },
];

type SingleKey = "meal" | "time" | "cook" | "mood" | "pepper";
const questions: { key: SingleKey; label: string; options: readonly Option[] }[] = [
  { key: "meal", label: "Which meal?", options: mealOptions },
  { key: "mood", label: "What's the mood?", options: moodOptions },
  { key: "time", label: "How much time?", options: timeOptions },
  { key: "cook", label: "Cook or buy?", options: cookOptions },
  { key: "pepper", label: "How much pepper?", options: pepperOptions },
];

const valueOf = (key: SingleKey) => (key === "pepper" ? pepper.value : answers[key]);
function choose(key: SingleKey, value: string) {
  if (key === "pepper") pepper.value = value;
  else (answers as Record<string, string>)[key] = value;
}
function toggleNoGo(value: string) {
  noGos.value = noGos.value.includes(value) ? noGos.value.filter((v) => v !== value) : [...noGos.value, value];
}

const match = computed(() =>
  matchDishes(
    { ...answers },
    { dietaryNeeds: noGos.value, pepperLevel: pepper.value, bodyType: null, favourites: [], dislikes: [] },
    []
  )
);

/** The plates on the tray: the best matches, repeated round the rim when there are few. */
const plates = computed<Recommendation[]>(() => {
  const top = match.value.ranked.slice(0, SLOTS);
  return top.length ? Array.from({ length: SLOTS }, (_, i) => top[i % top.length]) : [];
});

const rotation = ref(0);
const spinning = ref(false);
const winnerSlot = ref<number | null>(null);
const spins = ref(0);
const result = computed(() => (winnerSlot.value === null ? null : plates.value[winnerSlot.value]));

// A changed slip is a new tray, so the old answer no longer applies
watch(match, () => (winnerSlot.value = null));

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function spin() {
  const ranked = match.value.ranked;
  if (spinning.value || !ranked.length) return;

  // Random, but leaning towards the strongest matches
  const pool = ranked.slice(0, Math.min(5, ranked.length));
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const slots = plates.value.flatMap((p, i) => (p.dish.id === pick.dish.id ? [i] : []));
  const slot = slots[Math.floor(Math.random() * slots.length)];

  // Turn clockwise until `slot` sits under the pointer, with a little wobble so it never looks canned
  const target = (360 - slot * STEP) % 360;
  const now = ((rotation.value % 360) + 360) % 360;
  const wobble = (Math.random() - 0.5) * STEP * 0.5;
  rotation.value += 360 * 5 + ((target - now + 360) % 360) + wobble;

  winnerSlot.value = null;
  spinning.value = true;
  window.setTimeout(
    () => {
      spinning.value = false;
      winnerSlot.value = slot;
      spins.value += 1;
    },
    reduceMotion() ? 0 : SPIN_MS
  );
}

const plateStyle = (i: number) => {
  const angle = (i * STEP * Math.PI) / 180;
  return { left: `${50 + 36 * Math.sin(angle)}%`, top: `${50 - 36 * Math.cos(angle)}%` };
};

const relaxedLabel: Record<RelaxedAnswer, string> = {
  mood: "the mood",
  time: "the time",
  cook: "cook or buy",
  meal: "the meal",
};
const relaxedNote = computed(() => {
  const r = match.value.relaxed;
  if (!r.length) return "";
  const names = r.map((k) => relaxedLabel[k]);
  return `Nothing fit every answer, so we eased up on ${names.join(" and ")}.`;
});

const ringText = "Spin a dish • What should I eat? • ";
</script>

<template>
  <DialogRoot v-model:open="open">
    <!-- Launcher: a plate with its name turning round the rim -->
    <Transition
      enter-from-class="opacity-0 scale-75"
      leave-to-class="opacity-0 scale-75"
      enter-active-class="transition duration-500"
      leave-active-class="transition duration-200"
    >
      <button
        v-if="showLauncher"
        type="button"
        class="group fixed right-4 bottom-4 z-90 size-24 rounded-full bg-charcoal text-cream shadow-lift outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-saffron/60 md:right-8 md:bottom-8 md:size-28"
        aria-label="Open the chop wheel and spin for a dish"
        @click="open = true"
      >
        <svg viewBox="0 0 100 100" class="absolute inset-0 animate-[spin_18s_linear_infinite] group-hover:[animation-duration:6s]" aria-hidden="true">
          <defs>
            <path id="chop-ring" d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
          </defs>
          <text class="fill-cream/85 text-[8.6px] font-semibold uppercase tracking-[0.18em]">
            <textPath href="#chop-ring" textLength="242">{{ ringText }}</textPath>
          </text>
        </svg>
        <span
          class="absolute inset-[24%] grid place-items-center overflow-hidden rounded-full bg-terracotta ring-2 ring-saffron/70"
        >
          <img :src="plates[0]?.dish.img" alt="" class="size-full animate-simmer object-cover" />
        </span>
      </button>
    </Transition>

    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-[120] bg-charcoal/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
      />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-[121] grid max-h-[94dvh] w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-[2rem] bg-paper shadow-lift outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 md:grid-cols-[1fr_1.05fr] md:overflow-hidden"
      >
        <!-- The slip: what the guest is in the mood for -->
        <section class="grain relative bg-cream p-6 md:max-h-[94dvh] md:overflow-y-auto md:p-9">
          <!-- On mobile the panels stack, so close lives up here instead of on the stage -->
          <DialogClose
            class="absolute top-4 right-4 z-10 grid size-9 place-items-center rounded-full bg-charcoal/8 text-charcoal transition-colors hover:bg-charcoal/15 focus-visible:ring-2 focus-visible:ring-terracotta/50 outline-none md:hidden"
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </DialogClose>
          <p class="text-xs font-semibold tracking-[0.25em] text-terracotta uppercase">The chop wheel</p>
          <DialogTitle class="mt-3 text-3xl text-charcoal md:text-4xl">
            Tell us the vibe.<br />
            <span class="accent-italic">We'll turn the tray.</span>
          </DialogTitle>
          <DialogDescription class="mt-3 text-sm text-ink measure">
            Pick a few answers, then spin. The tray only carries dishes that fit, so wherever it stops is a
            good call.
          </DialogDescription>

          <ol class="mt-7 space-y-5">
            <li v-for="(q, qi) in questions" :key="q.key" class="grid grid-cols-[2rem_1fr] gap-x-2">
              <span class="pt-0.5 font-display text-sm text-terracotta/70 italic">{{ String(qi + 1).padStart(2, "0") }}</span>
              <div role="radiogroup" :aria-label="q.label">
                <p class="mb-2 text-sm font-medium text-charcoal">{{ q.label }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="opt in q.options"
                    :key="opt.value"
                    type="button"
                    role="radio"
                    :aria-checked="valueOf(q.key) === opt.value"
                    class="relative rounded-full border px-3.5 py-1.5 text-xs tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
                    :class="
                      valueOf(q.key) === opt.value
                        ? 'border-charcoal text-cream'
                        : 'border-line bg-paper/70 text-ink hover:border-terracotta/50 hover:text-charcoal'
                    "
                    @click="choose(q.key, opt.value)"
                  >
                    <motion.span
                      v-if="valueOf(q.key) === opt.value"
                      layout
                      :layout-id="`chop-${q.key}`"
                      class="absolute inset-0 rounded-full bg-charcoal"
                      :transition="{ type: 'spring', stiffness: 420, damping: 34 }"
                    />
                    <span class="relative">{{ opt.label }}</span>
                  </button>
                </div>
              </div>
            </li>

            <li class="grid grid-cols-[2rem_1fr] gap-x-2">
              <span class="pt-0.5 font-display text-sm text-terracotta/70 italic">06</span>
              <div>
                <p class="mb-2 text-sm font-medium text-charcoal">Any no-gos?</p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="opt in noGoOptions"
                    :key="opt.value"
                    type="button"
                    :aria-pressed="noGos.includes(opt.value)"
                    class="rounded-full border border-dashed px-3.5 py-1.5 text-xs tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50"
                    :class="
                      noGos.includes(opt.value)
                        ? 'border-olive bg-olive text-cream'
                        : 'border-ink/30 text-ink hover:border-olive hover:text-olive'
                    "
                    @click="toggleNoGo(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </li>
          </ol>
        </section>

        <!-- The stage: tray, pointer and the ticket it prints -->
        <section
          class="weave relative flex flex-col items-center gap-6 overflow-hidden bg-charcoal px-5 pt-10 pb-6 text-cream md:max-h-[94dvh] md:overflow-y-auto md:px-9"
        >
          <div
            class="pointer-events-none absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-terracotta/25 blur-3xl"
            aria-hidden="true"
          />

          <DialogClose
            class="absolute top-4 right-4 z-10 hidden size-9 place-items-center rounded-full bg-cream/10 md:grid text-cream transition-colors hover:bg-cream/20 focus-visible:ring-2 focus-visible:ring-saffron outline-none"
          >
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </DialogClose>

          <p class="relative text-[0.7rem] font-semibold tracking-[0.3em] text-cream/60 uppercase">
            {{ match.ranked.length }} {{ match.ranked.length === 1 ? "dish fits" : "dishes fit" }} your slip
          </p>

          <!-- Tray -->
          <div class="relative aspect-square w-full max-w-[21rem]">
            <!-- Pointer -->
            <svg
              viewBox="0 0 24 30"
              class="absolute -top-4 left-1/2 z-20 w-6 -translate-x-1/2 drop-shadow-[0_4px_6px_rgb(0_0_0/0.4)]"
              aria-hidden="true"
            >
              <path d="M12 30 L2 10 A10 10 0 1 1 22 10 Z" class="fill-saffron" />
              <circle cx="12" cy="10" r="3.5" class="fill-charcoal" />
            </svg>

            <div
              class="chop-tray absolute inset-0 rounded-full"
              :style="{
                transform: `rotate(${rotation}deg)`,
                transition: `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.72, 0.1, 1)`,
              }"
            >
              <div class="absolute inset-[7%] rounded-full border border-cream/15" aria-hidden="true" />
              <div
                v-for="(plate, i) in plates"
                :key="i"
                class="absolute size-[25%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper p-[5%] shadow-[0_8px_18px_-6px_rgb(0_0_0/0.55)] transition-all duration-500"
                :class="[
                  winnerSlot === i && 'z-10 scale-[1.22] ring-4 ring-saffron',
                  winnerSlot !== null && winnerSlot !== i && 'opacity-45 saturate-50',
                ]"
                :style="plateStyle(i)"
              >
                <img :src="plate.dish.img" :alt="plate.dish.name" class="size-full rounded-full object-cover" />
              </div>
            </div>

            <!-- Hub -->
            <button
              type="button"
              class="absolute inset-[34%] z-10 grid place-items-center rounded-full bg-cream text-charcoal shadow-[0_0_0_6px_rgb(0_0_0/0.18),0_12px_24px_-8px_rgb(0_0_0/0.6)] transition-transform outline-none hover:scale-105 focus-visible:ring-4 focus-visible:ring-saffron active:scale-95 disabled:cursor-progress disabled:hover:scale-100"
              :disabled="spinning || !plates.length"
              @click="spin"
            >
              <span class="flex flex-col items-center leading-none">
                <RotateCw class="mb-1 size-4 text-terracotta" :class="spinning && 'animate-spin'" />
                <span class="font-display text-xl font-semibold italic">{{ spinning ? "…" : spins ? "Again" : "Spin" }}</span>
              </span>
              <span class="sr-only">the tray</span>
            </button>
          </div>

          <!-- Ticket -->
          <div class="relative w-full max-w-md" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.article
                v-if="result"
                :key="`${result.dish.id}-${spins}`"
                class="chop-ticket bg-paper px-6 pt-5 pb-8 text-charcoal"
                :initial="{ opacity: 0, y: -24, scaleY: 0.6 }"
                :animate="{ opacity: 1, y: 0, scaleY: 1 }"
                :exit="{ opacity: 0, y: 12, transition: { duration: 0.15 } }"
                :transition="{ type: 'spring', stiffness: 260, damping: 24 }"
                style="transform-origin: top"
              >
                <div class="flex items-center justify-between border-b border-dashed border-line pb-2 text-[0.65rem] tracking-[0.25em] text-ink uppercase">
                  <span class="inline-flex items-center gap-1.5"><Sparkles class="size-3 text-terracotta" /> Your table is set</span>
                  <span>No. {{ String(spins).padStart(3, "0") }}</span>
                </div>
                <h3 class="mt-3 text-3xl">{{ result.dish.name }}</h3>
                <p class="mt-1 text-sm text-ink">{{ result.dish.note }}</p>

                <dl class="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div class="rounded-2xl bg-cream px-3 py-2">
                    <dt class="text-ink/70">Time</dt>
                    <dd class="mt-0.5 inline-flex items-center gap-1 font-medium"><Clock class="size-3" />{{ formatMinutes(result.dish.minutes) }}</dd>
                  </div>
                  <div class="rounded-2xl bg-cream px-3 py-2">
                    <dt class="text-ink/70">Pepper</dt>
                    <dd class="mt-0.5"><PepperMeter :level="result.dish.spice" /></dd>
                  </div>
                  <div class="rounded-2xl bg-cream px-3 py-2">
                    <dt class="text-ink/70">Spend</dt>
                    <dd class="mt-0.5 font-medium">{{ formatPriceShort(result.dish.price) }}</dd>
                  </div>
                </dl>

                <p class="mt-4 text-sm">{{ whyText(result.reasons, "Because it fits everything on your slip.") }}</p>
                <p class="mt-2 inline-flex items-center gap-1 text-xs text-ink"><MapPin class="size-3" />{{ result.dish.region }}</p>
                <p v-if="relaxedNote" class="mt-2 text-xs text-terracotta-deep italic">{{ relaxedNote }}</p>

                <div class="mt-5 flex flex-wrap items-center gap-2">
                  <Button variant="terracotta" size="lg" to="/onboarding/registration">Plan my week like this</Button>
                  <Button variant="link" class="text-charcoal" @click="spin">Spin again</Button>
                </div>
              </motion.article>

              <motion.div
                v-else
                key="waiting"
                class="rounded-3xl border border-dashed border-cream/25 px-6 py-7 text-center"
                :initial="{ opacity: 0 }"
                :animate="{ opacity: 1 }"
                :exit="{ opacity: 0, transition: { duration: 0.15 } }"
              >
                <p class="font-display text-xl italic text-cream/90">
                  {{ spinning ? "The tray is turning…" : plates.length ? "Hit spin in the middle of the tray." : "Nothing fits those no-gos yet." }}
                </p>
                <p class="mt-1 text-xs text-cream/55">
                  {{ plates.length ? "Change any answer and the tray restocks." : "Try a hotter pepper level or fewer no-gos." }}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Clay serving tray: a rim of tick marks round a warm glazed centre */
.chop-tray {
  background:
    repeating-conic-gradient(from 0deg, oklch(1 0 0 / 0.22) 0 0.6deg, transparent 0.6deg 7.5deg) center / 100% 100%,
    radial-gradient(circle at 35% 30%, var(--terracotta) 0%, var(--terracotta-deep) 62%, oklch(0.36 0.09 42) 100%);
  box-shadow:
    inset 0 0 0 10px oklch(0.36 0.09 42),
    inset 0 0 0 11px oklch(1 0 0 / 0.12),
    inset 0 10px 30px oklch(0 0 0 / 0.35),
    0 30px 60px -20px oklch(0 0 0 / 0.7);
  will-change: transform;
}

/* Receipt with a torn, zig-zag bottom edge */
.chop-ticket {
  border-radius: 1.25rem 1.25rem 0 0;
  --tooth: 4.5px;
  mask:
    linear-gradient(#000 0 0) top / 100% calc(100% - var(--tooth)) no-repeat,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / calc(var(--tooth) * 2) var(--tooth) repeat-x;
}
</style>
