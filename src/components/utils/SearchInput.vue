<script setup lang="ts">
import { Search } from '@lucide/vue';
import Input from '../ui/input/Input.vue';


const model = defineModel<string | number>()
</script>

<template>
     <Input
        name="foodSearch"
        v-model="model"
        input-class="inline-block bg-paper"
        :attrs="{
          placeholder: 'Search Food...',
        }"
      >
        <template #append-icon>
          <Search class="text-muted-foreground" />
        </template>
      </Input>
</template>