<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed, onMounted, ref } from "vue";

interface Props {
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  color: "border",
});

const borderColor = computed(() => cn('border-' + props.color));
console.log(borderColor.value);

const borderD = ref()

onMounted(() => {
    const borderDiv = document.getElementById('borderDiv')
    console.log(borderDiv)
    console.log(borderD)
})

</script>

<template>
  <div id="borderDiv" ref="borderD" :class="['border-[0.2px]', borderColor]" />
</template>
