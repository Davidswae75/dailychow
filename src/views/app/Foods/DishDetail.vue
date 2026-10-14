<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { CalendarPlus, CircleCheck, Heart, ThumbsDown } from "@lucide/vue";
import DishHero from "@/components/app/dish/DishHero.vue";
import DishFacts from "@/components/app/dish/DishFacts.vue";
import NutritionBars from "@/components/app/dish/NutritionBars.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import PlanDishSheet from "@/components/app/meals/PlanDishSheet.vue";
import Chip from "@/components/utils/chip.vue";
import Button from "@/components/ui/button/Button.vue";
import { useMealsStore } from "@/store";
import { useAlert } from "@/hooks";
import { bodyTypes, getDishById, type MealTime } from "@/lib/dishes";
import { currentMealSlot } from "@/lib/dates";
import { capitalize, joinReasons } from "@/lib/format";
import { labelOf, mealOptions, moodOptions } from "@/lib/options";

const route = useRoute();
const router = useRouter();
const meals = useMealsStore();
const { favourites, dislikes } = storeToRefs(meals);
const { alert } = useAlert();

const dish = computed(() => getDishById(String(route.params.id)));
const isFavourite = computed(() => !!dish.value && favourites.value.includes(dish.value.id));
const isDisliked = computed(() => !!dish.value && dislikes.value.includes(dish.value.id));

const goodFor = computed(() => {
  if (!dish.value) return [];
  const goals = dish.value.goals.map((g) => labelOf(moodOptions, g) || capitalize(g.replace("_", " ")));
  return [...dish.value.mealTimes.map((m) => labelOf(mealOptions, m)), ...goals];
});

const suits = computed(() =>
  joinReasons(
    (dish.value?.bodyTypes ?? []).map((b) => bodyTypes.find((t) => t.value === b)?.label.toLowerCase() ?? b)
  )
);

/** Allergens listed on the dish, plus the things it is free from. */
const allergenText = computed(() => {
  if (!dish.value) return "";
  const listed = dish.value.allergens.length ? `Contains ${joinReasons(dish.value.allergens)}` : "None listed";
  const freeFrom = [!dish.value.seafood && "seafood", !dish.value.peanut && "peanuts"].filter(Boolean) as string[];
  return freeFrom.length ? `${listed} · no ${joinReasons(freeFrom)}` : listed;
});

const planOpen = ref(false);
const planSlot = computed<MealTime>(() =>
  dish.value?.mealTimes.includes(currentMealSlot()) ? currentMealSlot() : dish.value?.mealTimes[0] ?? "dinner"
);

async function haveItNow() {
  if (!dish.value) return;
  await meals.logMeal(dish.value.id, planSlot.value);
  alert.success(`${dish.value.name} added to your history.`, { title: "Enjoy your chow" });
  router.push("/dashboard/home");
}

async function toggleDislike() {
  if (!dish.value) return;
  if (isDisliked.value) {
    await meals.undoDislike(dish.value.id);
    return;
  }
  await meals.dislike(dish.value.id);
  alert.info(`We won't suggest ${dish.value.name} again.`, {
    action: { label: "Undo", onClick: () => dish.value && meals.undoDislike(dish.value.id) },
  });
}
</script>

<template>
  <main v-if="dish" class="mx-auto max-w-6xl pb-32 md:grid md:grid-cols-[1fr_1.1fr] md:gap-8 md:px-8 md:py-6 md:pb-10">
    <div class="md:sticky md:top-20 md:h-[calc(100dvh-8rem)]">
      <DishHero :dish="dish" back-to="/dashboard/foods" back-label="Back to foods">
        <template #actions>
          <button
            type="button"
            :aria-label="isDisliked ? 'Allow this dish again' : 'Never suggest this'"
            :aria-pressed="isDisliked"
            class="grid size-11 place-items-center rounded-full shadow-soft transition-colors"
            :class="isDisliked ? 'bg-charcoal text-paper' : 'bg-paper text-charcoal'"
            @click="toggleDislike"
          >
            <ThumbsDown class="size-[18px]" />
          </button>
          <button
            type="button"
            :aria-label="isFavourite ? 'Remove from favourites' : 'Save to favourites'"
            :aria-pressed="isFavourite"
            class="grid size-11 place-items-center rounded-full shadow-soft transition-colors"
            :class="isFavourite ? 'bg-terracotta-deep text-paper' : 'bg-paper text-charcoal'"
            @click="meals.toggleFavourite(dish)"
          >
            <Heart class="size-[18px]" :class="isFavourite && 'fill-current'" />
          </button>
        </template>
      </DishHero>
    </div>

    <div class="relative -mt-7 flex flex-col gap-5 rounded-t-[30px] bg-cream px-5 pt-6 md:mt-0 md:rounded-none md:px-0 md:pt-0">
      <div class="space-y-1.5">
        <p class="text-sm text-ink">{{ dish.region }}</p>
        <h1 class="text-4xl md:text-5xl font-bold">{{ dish.name }}</h1>
        <p class="text-[15px] text-ink">{{ dish.note }}</p>
      </div>

      <DishFacts :dish="dish" />
      <p v-if="dish.buyFriendly" class="-mt-2 text-sm text-ink">Easy to buy ready-made if you'd rather not cook.</p>

      <section aria-labelledby="good-for" class="space-y-2.5">
        <h2 id="good-for" class="text-xl font-bold">Good for</h2>
        <div class="flex flex-wrap gap-1.5">
          <Chip v-for="item in goodFor" :key="item" class="text-sm! tracking-normal!">{{ item }}</Chip>
        </div>
        <p v-if="suits" class="text-sm text-ink">Suits {{ suits }} builds.</p>
      </section>

      <SurfaceCard class="space-y-3">
        <h2 class="text-xl font-bold">How filling it is</h2>
        <NutritionBars :nutrition="dish.nutrition" />
        <p class="text-[13px] text-ink">General guidance, not medical advice.</p>
      </SurfaceCard>

      <section aria-labelledby="ingredients" class="space-y-2">
        <h2 id="ingredients" class="text-xl font-bold">Ingredients</h2>
        <p class="text-[15px] leading-relaxed">{{ capitalize(dish.ingredients.join(", ")) }}</p>
      </section>

      <section v-if="dish.sides.length" aria-labelledby="sides" class="space-y-2.5">
        <h2 id="sides" class="text-xl font-bold">Goes well with</h2>
        <div class="flex flex-wrap gap-1.5">
          <Chip v-for="side in dish.sides" :key="side" class="text-sm! tracking-normal! capitalize">{{ side }}</Chip>
        </div>
      </section>

      <SurfaceCard class="flex items-center gap-3 py-3.5">
        <CircleCheck class="size-5 shrink-0 text-olive" />
        <div>
          <p class="text-sm font-bold">Allergens</p>
          <p class="text-sm text-ink">{{ allergenText }}</p>
        </div>
      </SurfaceCard>

      <div class="flex gap-2">
        <Button variant="outline" size="xl" class="grow gap-2 bg-paper" @click="planOpen = true">
          <CalendarPlus class="size-5" /> Add to planner
        </Button>
        <Button variant="deep" size="xl" class="grow" @click="haveItNow">
          Have it {{ planSlot === "dinner" ? "tonight" : "now" }}
        </Button>
      </div>
    </div>

    <PlanDishSheet v-model:open="planOpen" :dish="dish" />
  </main>

  <main v-else class="mx-auto max-w-xl px-5 py-16 text-center">
    <h1 class="text-3xl font-bold">We couldn't find that dish</h1>
    <RouterLink to="/dashboard/foods" class="mt-6 inline-flex font-semibold text-terracotta-deep underline">
      Back to foods
    </RouterLink>
  </main>
</template>
