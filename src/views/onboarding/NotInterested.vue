<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";

interface PreferenceOption {
  label: string;
  value: string;
}

interface PreferenceSection {
  title: string;
  type: "multiple" | "single";
  options: PreferenceOption[];
}

const sections: PreferenceSection[] = [
  {
    title: "Dietary needs",
    type: "multiple",
    options: [
      { label: "Vegetarian", value: "vegetarian" },
      { label: "No pork", value: "no_pork" },
      { label: "No Seafood", value: "no_seafood" },
      { label: "Peanut Allergy", value: "peanut_allergy" },
      { label: "Lactose Intolerant", value: "lactose_intolerant" },
    ],
  },
  {
    title: "Pepper Level",
    type: "single",
    options: [
      { label: "Mild", value: "mild" },
      { label: "Gentle", value: "gentle" },
      { label: "Medium", value: "medium" },
      { label: "Hot", value: "hot" },
      { label: "Proper Pepper", value: "proper_pepper" },
    ],
  },
];

interface PreferencesState {
  dietaryNeeds: string[];
  pepperLevel: string;
}

const model = defineModel<PreferencesState>({
  default: () => ({
    dietaryNeeds: [],
    pepperLevel: "",
  }),
});

const isSelected = (value: string, type: "multiple" | "single"): boolean => {
  return type === "multiple"
    ? model.value.dietaryNeeds.includes(value)
    : model.value.pepperLevel === value;
};

const toggleSelection = (value: string, type: "multiple" | "single"): void => {
  if (type === "multiple") {
    const current = model.value.dietaryNeeds;
    model.value.dietaryNeeds = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
  } else {
    model.value.pepperLevel = value;
  }
};
</script>

<template>
  <main class="space-y-3">
    <HeaderText
      eyebrow="Question 2 of 5"
      title="Anything off the table?"
      description="We'll never suggest a dish that breaks these."
    />

    <section class="space-y-3">
      <div
        v-for="section in sections"
        :key="section.title"
        class="space-y-2"
      >
        <p class="text-muted-foreground text-sm">
          {{ section.title }}
        </p>
        <div class="flex gap-1 flex-wrap">
          <Chip
            v-for="option in section.options"
            :key="option.value"
            :variant="isSelected(option.value, section.type) ? 'secondary' : 'primary'"
            hover
            @click="toggleSelection(option.value, section.type)"
          >
            {{ option.label }}
          </Chip>
        </div>
      </div>
    </section>
  </main>
</template>