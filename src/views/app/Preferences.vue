<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { LogOut, X } from "@lucide/vue";
import PageHeader from "@/components/app/common/PageHeader.vue";
import SurfaceCard from "@/components/app/common/SurfaceCard.vue";
import SettingsRow from "@/components/app/common/SettingsRow.vue";
import EditChoiceSheet from "@/components/app/common/EditChoiceSheet.vue";
import UserAvatar from "@/components/app/common/UserAvatar.vue";
import { useAuth, usePreferences } from "@/composables";
import { useMealsStore } from "@/store";
import { bodyTypes2 } from "@/types";
import { getDishById, dietaryOptions, goalOptions, labelOf, pepperOptions, type Option } from "@/lib";
import type { UserPreference } from "@/types";

const prefs = usePreferences();
const { user, goal, dietaryNeeds, pepperLevel, bodyTypeId } = prefs;
const meals = useMealsStore();
const { favourites, dislikes } = storeToRefs(meals);
const { signOutUser } = useAuth();

const bodyTypeOptions: Option[] = bodyTypes2.map((b) => ({ label: b.name, value: b.id }));

type Field = "goal" | "dietary" | "pepper" | "body";

/** Everything an editable row needs: label, current value, options and how to save it. */
interface FieldConfig {
  title: string;
  description?: string;
  options: Option[];
  multiple?: boolean;
  value: string | string[];
  display: string;
  toChanges: (value: string | string[]) => Partial<UserPreference>;
}

const fields = computed<Record<Field, FieldConfig>>(() => ({
  goal: {
    title: "Goal",
    options: goalOptions,
    value: goal.value,
    display: labelOf(goalOptions, goal.value) || "Not set",
    toChanges: (v) => ({ interests: v as string }),
  },
  dietary: {
    title: "Off the table",
    description: "We'll never suggest a dish that breaks these.",
    options: dietaryOptions,
    multiple: true,
    value: dietaryNeeds.value,
    display: dietaryNeeds.value.map((v) => labelOf(dietaryOptions, v)).join(", ") || "Nothing",
    toChanges: (v) => ({
      notInterested: { pepperLevel: pepperLevel.value, dietaryNeeds: v as string[] },
    }),
  },
  pepper: {
    title: "Pepper level",
    options: pepperOptions,
    value: pepperLevel.value,
    display: labelOf(pepperOptions, pepperLevel.value) || "Not set",
    toChanges: (v) => ({
      notInterested: { dietaryNeeds: dietaryNeeds.value, pepperLevel: v as string },
    }),
  },
  body: {
    title: "Body type",
    description: "Used to size portions. Optional.",
    options: bodyTypeOptions,
    value: bodyTypeId.value,
    display: labelOf(bodyTypeOptions, bodyTypeId.value) || "Not set",
    toChanges: (v) => {
      const body = bodyTypes2.find((b) => b.id === v)!;
      return { bodyType: { ...body } };
    },
  },
}));

const editing = ref<Field | null>(null);
const sheetOpen = ref(false);
const saving = ref(false);

function edit(field: Field) {
  editing.value = field;
  sheetOpen.value = true;
}

async function save(value: string | string[]) {
  if (!editing.value) return;
  saving.value = true;
  const ok = await prefs.save(fields.value[editing.value].toChanges(value));
  saving.value = false;
  if (ok) sheetOpen.value = false;
}

const dislikedDishes = computed(() => dislikes.value.map(getDishById).filter((d) => d !== null));
const joined = computed(() => {
  const date = user.value?.joinedDate ? new Date(user.value.joinedDate as string) : null;
  return date && !Number.isNaN(date.getTime())
    ? `since ${date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : "";
});
</script>

<template>
  <main class="mx-auto flex max-w-2xl flex-col gap-5 px-5 py-6 pb-32 md:px-8 md:pb-10">
    <PageHeader title="Preferences" />

    <SurfaceCard class="flex items-center gap-3.5 py-4">
      <UserAvatar :name="user?.fullName" size="lg" />
      <div class="min-w-0">
        <p class="text-lg font-bold">{{ user?.fullName ?? "Guest" }}</p>
        <p class="truncate text-sm text-ink">
          {{ user?.email ?? "Not signed in" }}<template v-if="joined"> · {{ joined }}</template>
        </p>
      </div>
    </SurfaceCard>

    <section aria-labelledby="taste" class="flex flex-col gap-2">
      <h2 id="taste" class="text-[13px] font-bold tracking-wide text-ink uppercase">Your taste</h2>
      <SurfaceCard :padded="false" class="overflow-hidden">
        <SettingsRow
          v-for="(field, key) in fields"
          :key="key"
          :label="field.title"
          :value="field.display"
          @select="edit(key as Field)"
        />
        <RouterLink to="/dashboard/foods" class="flex min-h-14 items-center gap-3 px-4 hover:bg-cream/60">
          <span class="grow text-[15px] font-medium">Favourites</span>
          <span class="text-sm text-ink">{{ favourites.length }} dishes · add from any dish</span>
        </RouterLink>
      </SurfaceCard>
    </section>

    <section v-if="dislikedDishes.length" aria-labelledby="never" class="flex flex-col gap-2">
      <h2 id="never" class="text-[13px] font-bold tracking-wide text-ink uppercase">Never suggest</h2>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="dish in dislikedDishes"
          :key="dish!.id"
          type="button"
          :aria-label="`Allow ${dish!.name} again`"
          class="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper py-2 pr-2.5 pl-3.5 text-sm hover:border-terracotta-deep"
          @click="meals.undoDislike(dish!.id)"
        >
          {{ dish!.name }} <X class="size-3.5" />
        </button>
      </div>
    </section>

    <section aria-labelledby="account" class="flex flex-col gap-2">
      <h2 id="account" class="text-[13px] font-bold tracking-wide text-ink uppercase">Account</h2>
      <SurfaceCard :padded="false" class="overflow-hidden">
        <!-- <SettingsRow label="Change password" value="We'll email you a link" @select="prefs.resetPassword()">
          <template #icon><KeyRound class="size-[18px] text-ink" /></template>
        </SettingsRow> -->
        <SettingsRow label="Sign out" @select="signOutUser()">
          <template #icon><LogOut class="size-[18px] text-ink" /></template>
        </SettingsRow>
      </SurfaceCard>
    </section>

    <EditChoiceSheet
      v-if="editing"
      v-model:open="sheetOpen"
      :title="fields[editing].title"
      :description="fields[editing].description"
      :options="fields[editing].options"
      :value="fields[editing].value"
      :multiple="fields[editing].multiple"
      :saving="saving"
      @save="save"
    />
  </main>
</template>
