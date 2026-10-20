/**
 * Tonight's answers and the dish they lead to. Shared by Home, Pick and the
 * result screen, so "Pick another" on one screen is the same pick everywhere.
 */
import { defineStore, storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useMealsStore } from "./meals";
import { matchDishes, type PickAnswers, currentMealSlot } from "@/lib";

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

  const match = computed(() =>
    matchDishes(
      answers.value,
      taste.value,
      history.value.map((e) => e.log)
    )
  );
  const ranked = computed(() => match.value.ranked);
  /** Answers that had to be ignored because nothing matched them all. */
  const relaxed = computed(() => match.value.relaxed);

  const current = computed(() => {
    const list = ranked.value;
    return list.length ? list[position.value % list.length] : null;
  });

  /** Moves to the next dish; returns false when it has wrapped back to the first. */
  function pickAnother() {
    position.value += 1;
    return ranked.value.length > 1 && position.value % ranked.value.length !== 0;
  }

  /** Index of the showing dish within `ranked`. */
  const index = computed({
    get: () => (ranked.value.length ? position.value % ranked.value.length : 0),
    set: (i: number) => (position.value = i),
  });

  function setAnswer<K extends keyof PickAnswers>(key: K, value: PickAnswers[K]) {
    answers.value = { ...answers.value, [key]: value };
  }

  /** Logs the current dish as eaten for the chosen meal. */
  const haveIt = () => (current.value ? meals.logMeal(current.value.dish.id, answers.value.meal) : Promise.resolve());

  return { answers, ranked, relaxed, current, index, pickAnother, setAnswer, haveIt };
});
