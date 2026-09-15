<script setup lang="ts">
import HeaderText from './HeaderText.vue';
import WhyCard from './WhyCard.vue';

</script>


<template>
    <main class="bg-cream" id="why">
        <section class="standard_width">
            <HeaderText eyebrow="Why use it" title="Four reasons this beats staring into the pot."/>
        <div class="grid md:grid-cols-2">
            <WhyCard/>
        </div>
        </section>
    </main>
</template>