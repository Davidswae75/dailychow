<script setup lang="ts">
import HeaderText from "./HeaderText.vue";
import processes from "@/assets/illo-journey.png";
import ProcessesCard from "./ProcessesCard.vue";
import Reveal from "../utils/Reveal.vue";
</script>

<template>
  <main class="bg-cream/50" id="how">
    <section class="standard_width">
      <div>
        <HeaderText
          eyebrow="how it work"
          :title="`Three small steps between 'I don't know' and food on the table.`"
          reduce-width
        />
      </div>
      <div class="text-center mx-auto">
        <Reveal
          once
          :initial="{
            scale: 0.8,
          }"
          :target="{
            scale: 1,
          }"
        >
          <img :src="processes" alt="processes" class="object-contain" />
        </Reveal>
      </div>

      <ProcessesCard />
    </section>
  </main>
</template>
