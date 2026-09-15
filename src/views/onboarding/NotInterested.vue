<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Chip from "@/components/utils/chip.vue";
import { ref } from "vue";

const list = [
  {
    title: "Dietary needs",
    options: [
      {
        label: "Vegeterian",
        value: "vegeterian",
      },
      {
        label: "No pork",
        value: "no_pork",
      },
      {
        label: "No Seafood",
        value: "no_seafood",
      },
      {
        label: "Peanut Allergy",
        value: "peanut_allergy",
      },
      {
        label: "Lactose Intolerant",
        value: "lactose_intolerant",
      },
    ],
  },
  {
    title: "Pepper Level",
    options: [
      {
        label: "Mild",
        value: "mild",
      },
      {
        label: "Gentle",
        value: "gentle",
      },
      {
        label: "Medium",
        value: "medium",
      },
      {
        label: "Hot",
        value: "hot",
      },
      {
        label: "Proper Pepper",
        value: "proper_pepper",
      },
    ],
  },
];

interface LocalState {
  dietaryNeeds: string[];
  pepperLevel: string;
}

const localState = ref<LocalState>({
  dietaryNeeds: [],
  pepperLevel: "",
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: LocalState): void
}>()

const handleMultipleSelection = (select: string) => {
  if (localState.value.dietaryNeeds.includes(select)) {
    localState.value.dietaryNeeds = localState.value.dietaryNeeds.filter(
      (l) => l != select
    );
  } else {
    localState.value.dietaryNeeds = [...localState.value.dietaryNeeds, select];
  }

  emit('update:modelValue', localState.value)
  
};

const handleSingleSelection = (select: string) => {
  localState.value.pepperLevel = select;

  emit('update:modelValue', localState.value)
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
      <div v-for="l in list.slice(0, 1)" :key="l.title" class="space-y-2">
        <p class="text-muted-foreground text-sm">
          {{ l.title }}
        </p>
        <div class="flex gap-1 flex-wrap">
          <Chip
            :variant="
              localState.dietaryNeeds.includes(o.value)
                ? 'secondary'
                : 'primary'
            "
            hover
            v-for="o in l.options"
            :key="o.value"
            @click="handleMultipleSelection(o.value)"
            >{{ o.label }}</Chip
          >
        </div>
      </div>

      <div v-for="l in list.slice(1)" :key="l.title" class="space-y-2">
        <p class="text-muted-foreground text-sm">
          {{ l.title }}
        </p>
        <div class="flex gap-1 flex-wrap">
          <Chip
            :variant="
              localState.pepperLevel == o.value ? 'secondary' : 'primary'
            "
            hover
            @click="handleSingleSelection(o.value)"
            v-for="o in l.options"
            :key="o.value"
            >{{ o.label }}</Chip
          >
        </div>
      </div>
    </section>
  </main>
</template>
