<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { RefreshCw } from "@lucide/vue";
import DishHero from "@/components/app/dish/DishHero.vue";
import DishFacts from "@/components/app/dish/DishFacts.vue";
import IngredientChecklist from "@/components/app/dish/IngredientChecklist.vue";
import Button from "@/components/ui/button/Button.vue";
import { usePickStore } from "@/store";
import { useAlert } from "@/hooks";
import { whyText } from "@/lib/format";
import { labelOf, mealOptions } from "@/lib/options";

const pick = usePickStore();
const { current, answers } = storeToRefs(pick);
const router = useRouter();
const { alert } = useAlert();

/** Ingredients already at home; resets when the dish changes. */
const have = ref<string[]>([]);
watch(() => current.value?.dish.id, () => (have.value = []));

const saving = ref(false);

async function haveIt() {
  if (!current.value) return;
  // Read the name first: logging the meal re-ranks picks, so `current` changes
  const name = current.value.dish.name;
  saving.value = true;
  try {
    await pick.haveIt();
    alert.success(`${name} added to your history.`, { title: "Enjoy your chow" });
    router.push("/dashboard/home");
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main v-if="current" class="mx-auto max-w-6xl pb-32 md:grid md:grid-cols-2 md:gap-8 md:px-8 md:py-6 md:pb-10">
    <DishHero :dish="current.dish" back-to="/dashboard/pick" back-label="Back to tonight's answers" />

    <div class="relative -mt-7 flex flex-col gap-4 rounded-t-[30px] bg-cream px-5 pt-6 md:mt-0 md:rounded-none md:px-0 md:pt-0">
      <div class="space-y-1.5">
        <p class="text-sm font-bold tracking-wide text-terracotta-deep uppercase">
          {{ labelOf(mealOptions, answers.meal) }} · tonight's dish
        </p>
        <h1 class="text-4xl md:text-5xl font-bold">{{ current.dish.name }}</h1>
        <p class="text-[15px] text-ink">{{ current.dish.note }}</p>
      </div>

      <DishFacts :dish="current.dish" />

      <p class="grain rounded-[22px] border border-border bg-paper px-4 py-3 text-sm leading-relaxed text-ink">
        <strong class="text-charcoal">Why this one:</strong>
        {{ whyText(current.reasons, current.dish.note) }}
      </p>

      <IngredientChecklist v-model="have" :ingredients="current.dish.ingredients" />

      <div
        class="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-cream/95 px-5 pt-3 pb-6 backdrop-blur-md md:static md:mt-2 md:border-0 md:bg-transparent md:p-0"
      >
        <button
          type="button"
          aria-label="Pick another dish"
          class="grid size-13 shrink-0 place-items-center rounded-full border border-border bg-paper transition-colors hover:border-terracotta-deep"
          @click="pick.pickAnother()"
        >
          <RefreshCw class="size-5" />
        </button>
        <RouterLink
          :to="`/dashboard/foods/${current.dish.id}`"
          class="flex h-13 shrink-0 items-center rounded-full border border-border bg-paper px-5 text-[15px] font-semibold"
        >
          Details
        </RouterLink>
        <Button
          variant="deep"
          class="h-13 grow text-base"
          :loading="saving"
          @click="haveIt"
        >
          I'll have this
        </Button>
      </div>
    </div>
  </main>

  <main v-else class="mx-auto max-w-xl px-5 py-16 text-center">
    <h1 class="text-3xl font-bold">Nothing fits tonight</h1>
    <p class="mt-2 text-ink">Your answers and no-go foods rule out every dish. Try a bigger budget or more time.</p>
    <RouterLink to="/dashboard/pick" class="mt-6 inline-flex font-semibold text-terracotta-deep underline">
      Change tonight's answers
    </RouterLink>
  </main>
</template>
