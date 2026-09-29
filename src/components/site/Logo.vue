<script setup lang="ts">
import { CookingPot } from '@lucide/vue';
import { computed } from 'vue';


// vue-tsc -b && 
type Sizes = 'sm' | 'md' | 'lg' | 'xl'
const props = withDefaults(defineProps<{
    name?: string;
    size?: Sizes;
    bg?: boolean;
    containerClass?: string
}>(), {
    name: 'Daily Chow',
    size: 'sm',
    bg: false
})

const sizes = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-9 stroke-2',
    xl: 'size-12 stroke-2',
}

const bgColor = computed(() => props.bg ? 'bg-cream text-terracotta' : 'bg-terracotta text-cream')

</script>

<template>
   <div class="flex gap-1.5 items-center" :class="containerClass">
    <div class="grid place-items-center rounded-full p-2" :class="[bgColor]">
        <CookingPot :class="sizes[size]"/>
    </div>
    <p v-if="name" class="text-terracotta font-bold font-text text-lg md:text-xl">{{ name }}</p>
   </div>
</template>