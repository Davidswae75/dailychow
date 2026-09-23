<script setup lang="ts">
import AuthForm, {
  type AuthFormType,
} from "@/components/site/Auth/AuthForm.vue";
import { loginSchema } from "@/types";
import { useForm } from "vee-validate";
import { defineComponent } from "vue";

const { values, setFieldValue, handleSubmit } = useForm<AuthFormType>({
  validationSchema: loginSchema,
  initialValues: {
    email: "",
    password: "",
  },
});
const submitForm = handleSubmit(async (formValues) => {
  console.log(formValues);
});

defineComponent({
  name: 'Login'
})
</script>

<template>
  <main class="min-h-screen bg-cream grain border flex items-center">
    <section class="w-full sm:w-2/3 lg:w-1/3 mx-auto px-5 md:px-8">
      <form @submit.prevent="submitForm">
        <AuthForm
          :modelValue="{ email: values.email, password: values.password }"
          @update:modelValue="
            (val) => {
              setFieldValue('email', val.email);
              setFieldValue('password', val.password);
            }
          "
          mode="login"
        />
      </form>
    </section>
  </main>
</template>
