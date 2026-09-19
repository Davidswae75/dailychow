<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import ChipSelect from "@/components/utils/ChipSelect.vue";
import {
  bodyTypes2,
  bodyTypesByCategory,
  type BodyType,
  type BodyTypesByCategory,
} from "@/types";

const bodyTypeskeys = Object.keys(bodyTypesByCategory) as BodyTypesByCategory[];

const model = defineModel<BodyType>({
  default: () => ({
    category: "Lean",
    id: "",
    name: "",
  }),
});


</script>

<template>
  <main class="space-y-3 p-1">
    <HeaderText
      eyebrow="Question 3 of 5"
      title="Tell Us Your Body Type"
      description="Make we help your life"
    />

    <section class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <ChipSelect v-model="model" :options="bodyTypes2" />
      </div>
   
    </section>
  </main>
</template>
