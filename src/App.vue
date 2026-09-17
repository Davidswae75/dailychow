<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { computed } from "vue";


const layouts = {
  default : DefaultLayout
}
const route = useRoute()

const getLayout = computed(() => {
  const layoutName = route.meta.layout
  return layouts[layoutName as keyof typeof layouts] || layouts['default']
})
</script>

<template>
  <component :is="getLayout">
    <RouterView />
  </component>
</template>
