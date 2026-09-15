<script setup lang="ts">
import { CookingPot } from '@lucide/vue';


// vue-tsc -b && 
withDefaults(defineProps<{
    name?: string
}>(), {
    name: 'Daily Chow'
})

</script>

<template>
   <div class="flex gap-1.5 items-center">
    <div class="grid place-items-center bg-terracotta rounded-full p-2 text-cream">
        <CookingPot class="size-4"/>
    </div>
    <p class="text-charcoal font-bold font-text text-lg md:text-xl">{{ name }}</p>
   </div>
</template>