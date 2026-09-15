<script lang="ts" setup>
import problem from "@/assets/illo-problem.png";
import HeaderText from "./HeaderText.vue";
import Reveal from "../utils/Reveal.vue";
</script>

<template>
  <main class="bg-cream" id="problem">
    <Reveal>
      <section class="standard_width grid md:grid-cols-2 gap-16">
        <div class="order-2 md:order-1">
        <Reveal direction="right" once>
          <img
            :src="problem"
            :width="700"
            class="object-contain aspect-auto animate-simmer"
          />
        </Reveal>
        </div>

        <div class="order-1 md:order-2">
         <Reveal direction="left" once>
          <HeaderText
            eyebrow="The daily stall"
            title="It is 7pm, everyone is hungry, and nobody will say what they want."
          >
            <template #description>
              <p class="text-muted-foreground">
                <span class="text-charcoal">
                  The stall costs you time you don't have.</span
                >
                You open the fridge, close it, scroll a bit, ask the house, get
                "anything" as an answer. Twenty minutes gone before a single pot
                touches fire — and the longer it drags, the more likely it ends
                in indomie or a delivery you regret paying for.
              </p>
              <p class="text-muted-foreground">
                <span class="text-charcoal"
                  >You end up cooking the same five things.
                </span>
                Jollof, stew and rice, beans, spaghetti, egg sauce. Meanwhile
                abacha, ofada, gbegiri, afang, ukwa, tuwo shinkafa and moi moi
                sit forgotten — not because you dislike them, but because nobody
                reminded you at the moment you were deciding.
              </p>
              <p class="text-muted-foreground">
                <span class="text-charcoal">
                  And the food rarely matches the day.</span
                >
                Some evenings you want light and peppery. Some mornings you want
                akara and pap and nothing else. Some weeks the market money is
                thin and you need something that stretches. Recipe apps don't
                ask any of that. They just hand you ten thousand options.
              </p>
            </template>
          </HeaderText>
         </Reveal>
        </div>
      </section>
    </Reveal>
  </main>
</template>
