<script setup lang="ts">
import { ArrowBigDown,  Flame } from "@lucide/vue";
import Chip from "../utils/chip.vue";
import heroSpread from "@/assets/hero-spread.jpg";
import Button from "../ui/button/Button.vue";
import Reveal from "../utils/Reveal.vue";
import { useAlert } from "@/hooks/useAlert";
import AlertBar from "../utils/AlertBar.vue";
import { watch } from "vue";


const processes: { label: string; type: "accent" | "secondary" | "primary" }[] =
  [
    {
      label: "45 mins",
      type: "accent",
    },
    {
      label: "₦2,500 for two",
      type: "secondary",
    },
    {
      label: "Peppery",
      type: "primary",
    },
  ];

  const { alert, alertArray } = useAlert()


</script>

<template>
  <AlertBar :alerts="alertArray"/>
  
  <main class="relative min-h-[42rem]" id="hero">
    <div
      class="bg-linear-to-r from-cream via-cream/90 to-cream/40 -z-10 inset-0 top-0 absolute"
    ></div>
    <div
      class="bg-linear-to-t from-cream via-cream/60 to-cream/40 -z-10 inset-0 top-0 absolute"
    ></div>
    <div class="inset-0 top-0 left-0 right-0 absolute -z-20 overflow-hidden">
      <img
        :src="heroSpread"
        alt=""
        class="object-cover animate-drift h-full"
        :width="2000"
        :height="2000"
      />
    </div>

    <section class="standard_width z-10 grid md:grid-cols-2 gap-10">
      <div class="space-y-6">
        <Reveal once>
          <Chip class="uppercase" icon-class="" :icon="Flame" variant="primary"
            >Nigerian Hot Dish </Chip>
        </Reveal>
        <div class="md:text-7xl font-text text-4xl flex flex-col font-bold">
          <Reveal once :delay="0.3">
            <span>What should </span>
            <span>we eat </span>
            <span class="text-terracotta">tonight?</span>
          </Reveal>
        </div>

        <Reveal once :delay="0.4">
          <p class="text-muted-foreground font-body">
            Naija Plate answers that question for you. Tell it your mood, how
            much time you have and what's in your pocket, and it names one
            Nigerian dish to cook or buy right now — jollof, egusi, ofada,
            pepper soup, akara — with the shortlist of what you need for it.
          </p>
        </Reveal>

        <Reveal once :delay="0.5">
          <div class="flex items-center">
            <Button
              variant="terracotta"
              size="xl"
              class="rounded-full flex items-center"
              @click="alert.info('Test run')"
              >Find tonight's dish <ArrowBigDown />
            </Button>
            <Button variant="link" class="text-lg rounded-none !no-underline"
              ><p class="border-b border-ink/50 pb-2">How it works</p>
            </Button>
          </div>
        </Reveal>
        <Reveal once :delay="0.6"></Reveal>
      </div>

      <aside class="self-end w-full">
        <Reveal once :delay="0.6">
          <div
            class="bg-paper space-y-2 md:w-3/5 p-4 rounded-4xl grain mx-auto"
          >
            <p class="text-terracotta">Today's Pick</p>
            <p class="text-charcoal text-3xl">Ofada rice & ayamase</p>
            <p class="text-muted-foreground text-sm">
              Because you said you had 45 minutes, wanted something heavy, and
              you last ate rice three days ago.
            </p>

            <div class="inline-flex gap-1 flex-wrap">
              <Chip
                v-for="tag in processes"
                :key="tag.label"
                :variant="tag.type!"
                >{{ tag.label }}</Chip
              >
            </div>
          </div>
        </Reveal>
      </aside>
    </section>
  </main>
</template>
