import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import { useUiStore } from "@/store/ui";
import { updatePreferences, sendPasswordReset } from "@/firebase/services/meals";
import { getError } from "@/firebase/utils/error";
import type { UserPreference } from "@/types";

/** Reads and saves the user's onboarding answers from the Preferences screen. */
export function usePreferences() {
  const { user } = storeToRefs(useUserStore());
  const { alert } = useUiStore();

  const goal = computed(() => user.value?.interests ?? "");
  const dietaryNeeds = computed(() => user.value?.notInterested?.dietaryNeeds ?? []);
  const pepperLevel = computed(() => user.value?.notInterested?.pepperLevel ?? "");
  const bodyTypeId = computed(() => user.value?.bodyType?.id ?? "");

  async function save(changes: Partial<UserPreference>) {
    if (!user.value) {
      alert.warning("Sign in to save your preferences.");
      return false;
    }
    try {
      await updatePreferences(user.value.id, changes);
      alert.success("Your preferences are updated.", { title: "Saved" });
      return true;
    } catch (error) {
      getError(error);
      return false;
    }
  }

  async function resetPassword() {
    if (!user.value?.email) return;
    try {
      await sendPasswordReset(user.value.email);
      alert.info(`We sent a reset link to ${user.value.email}.`, { title: "Check your inbox" });
    } catch (error) {
      getError(error);
    }
  }

  return { user, goal, dietaryNeeds, pepperLevel, bodyTypeId, save, resetPassword };
}
