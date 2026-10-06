<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";

import { Calendar, Plus } from "@lucide/vue";
import ContentCard from "@/components/utils/ContentCard.vue";
import ShowCard from "@/components/site/ShowCard.vue";
</script>
<!-- todo note: build card for each of the dashboard ui cards -->

<template>
  <main class="grid grid-cols-12 px-5 md:px-8 py-5 gap-3 *:rounded-2xl">
    <ShowCard class="col-span-12 md:col-span-8" />

    <ContentCard
      class="md:col-span-4 col-span-12"
      eyebrow="Today"
      border
      title="Fixed Meals"
    >
      <div class="border-dashed border p-3 border-border rounded-lg bg-cream">
        <div class="mx-auto space-y-3">
          <Calendar class="size-8 text-terracotta mx-auto" />
          <p class="text-center text-base text-charcoal">
            No meal fixed for today.
          </p>
          <div class="mx-auto text-center">
            <Button
              variant="terracotta"
              class="text-cream inline-flex gap-1 mx-auto"
              ><Plus /> Add One</Button
            >
          </div>
        </div>
      </div>
    </ContentCard>
  
  </main>
</template>
