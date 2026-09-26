<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { computed } from "vue";
import Dashboard from "./layouts/Dashboard.vue";
import AlertBar from "./components/utils/AlertBar.vue";


const layouts = {
  default : DefaultLayout,
  dashboard: Dashboard
}
const route = useRoute()

const getLayout = computed(() => {
  const layoutName = route.meta.layout
  return layouts[layoutName as keyof typeof layouts] || layouts['default']
})
</script>

<template>
<main>
  <AlertBar />
  <component :is="getLayout">
    <RouterView />
  </component>

</main>
</template>
