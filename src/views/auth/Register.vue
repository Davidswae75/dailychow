<script setup lang="ts">
import AuthForm, { type AuthFormType } from '@/components/site/Auth/AuthForm.vue';

const model = defineModel<AuthFormType>({
    default: () => ({
        email: '',
        password: '',
        fullName: '',
    })
})
</script>


<template>
    <AuthForm v-model="model" mode="register"/>
</template>