<script setup lang="ts">
import Button from '../ui/button/Button.vue';

</script>

<template>
    <main class="bg-cream/30 grain py-20 md:py-24 border border-line border-y animate__animated animate__headShake  animate__infinite" id="cta">
        <section class="mx-auto max-w-3xl">
            <div class="flex flex-col justify-center items-center gap-5">
                <p class="text-charcoal text-2xl font-bold md:text-5xl font-text">Stop wondering. Start cooking.</p>
                <p class="text-muted-foreground text-center">Leave your email and we'll send your first dish, picked for a Nigerian kitchen, the day the picker opens.</p>

                <div>
                    <form class="flex flex-col gap-3 md:flex-row">
                            <input class="h-14 rounded-full border border-line outline-0 w-64 px-5 bg-cream focus:ring-terracotta focus:border-none focus:ring-2" placeholder="your@email.com"/>
                        <Button variant="terracotta" size="2xl" class="rounded-full">Send my first dish</Button>
                    </form>
                </div>
            </div>
        </section>
    </main>
</template>


<style scoped>
.animate__animated animate__headShake  {
    animation-duration: 10s;
}
</style>