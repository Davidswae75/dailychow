<script setup lang="ts">
import Cta from "@/components/landing/Cta.vue";
import DishWall from "@/components/landing/DishWall.vue";
import Faqs from "@/components/landing/Faqs.vue";
import Hero from "@/components/landing/Hero.vue";
import NavBar from "@/components/landing/NavBar.vue";
import Problem from '@/components/landing/Problem.vue'
import Processes from "@/components/landing/Processes.vue";
import SiteFooter from "@/components/landing/SiteFooter.vue";
import Voices from "@/components/landing/Voices.vue";
import Why from "@/components/landing/Why.vue";
</script>

<template>
  <main >
    <NavBar />
    <Hero />
    <Problem/>
    <Processes/>
    <DishWall/>
    <Why/>
    <Voices/>
    <Faqs/>
    <Cta/>
    <SiteFooter/>
  </main>
</template>
