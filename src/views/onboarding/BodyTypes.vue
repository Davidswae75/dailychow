<script setup lang="ts">
import HeaderText from '@/components/landing/HeaderText.vue';
import Chip from '@/components/utils/chip.vue';
import { bodyTypes, type BodyType } from '@/types';

const bodyTypeskeys = Object.keys(bodyTypes)

const model = defineModel<BodyType>({
    default: () => ({
        category: 'Athletic',
        description: '',
        id: '',
        name: ''
    })
})

</script>


<template>
    <main class="space-y-3">
        <HeaderText eyebrow="Question 3 of 5" title="Tell Us Your Body Type" description="Make we help your life"/>
        

        <section class="space-y-3">
            <div class="flex flex-wrap" v-for="b in bodyTypeskeys" :key="b">
                <Chip variant="primary" hover />
            </div>
        </section>
        
    </main>
</template>