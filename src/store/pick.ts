/**
 * Tonight's answers and the dish they lead to. Shared by Home, Pick and the
 * result screen, so "Pick another" on one screen is the same pick everywhere.
 */
import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useMealsStore } from "./meals";
import { recommendDishes, type PickAnswers, currentMealSlot } from "@/lib";

const STORAGE_KEY = "dailychow:last-answers";

function loadAnswers(): PickAnswers {
  const fallback: PickAnswers = {
    meal: currentMealSlot(),
    time: "45",
    budget: "1000-3000",
    cook: "cook",
    mood: "comfort",
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    // The meal follows the clock; everything else is remembered
    return saved ? { ...fallback, ...saved, meal: currentMealSlot() } : fallback;
  } catch {
    return fallback;
  }
}

export const usePickStore = defineStore("pick", () => {
  const meals = useMealsStore();
  const { history, taste } = storeToRefs(meals);

  const answers = ref<PickAnswers>(loadAnswers());
  /** Which ranked dish is showing; "Pick another" moves it along. */
  const position = ref(0);

  watch(
    answers,
    (value) => {
      position.value = 0;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
        /* storage can be unavailable (private mode); answers still work for this visit */
      }
    },
    { deep: true }
  );

  const ranked = computed(() =>
    recommendDishes(
      answers.value,
      taste.value,
      history.value.map((e) => e.log)
    )
  );

  const current = computed(() => {
    const list = ranked.value;
    return list.length ? list[position.value % list.length] : null;
  });

  const pickAnother = () => (position.value += 1);

  function setAnswer<K extends keyof PickAnswers>(key: K, value: PickAnswers[K]) {
    answers.value = { ...answers.value, [key]: value };
  }

  /** Logs the current dish as eaten for the chosen meal. */
  const haveIt = () => (current.value ? meals.logMeal(current.value.dish.id, answers.value.meal) : Promise.resolve());

  return { answers, ranked, current, pickAnother, setAnswer, haveIt };
});
