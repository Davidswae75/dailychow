<script setup lang="ts">
import AuthForm from '@/components/site/Auth/AuthForm.vue';
import type { RegisterSchemaType, UserProps } from '@/types';

defineProps<{
    form: RegisterSchemaType
}>()

</script>


<template>
    <AuthForm :form="form" mode="register"/>
</template>