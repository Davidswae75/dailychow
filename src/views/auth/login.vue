<script setup lang="ts">
import AuthForm, {
  type AuthFormType,
} from "@/components/site/Auth/AuthForm.vue";
import { getError } from "@/firebase/utils/error";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/types";
import { useForm } from "vee-validate";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const { signIn } = useAuth();
const router = useRouter()

const { values, setFieldValue, handleSubmit } = useForm<AuthFormType>({
  validationSchema: loginSchema,
  initialValues: {
    email: "",
    password: "",
  },
});
const submitForm = handleSubmit(async (formValues) => {
  if (!formValues) return;
  try {
   await signIn("login", formValues.email, formValues.password);
    router.push('/dashboard/home')
  } catch (error) {
    getError(error);
  }
});

defineComponent({
  name: "Login",
});
</script>

<template>
  <main class="min-h-screen bg-cream grain border flex items-center">
    <section class="w-full sm:w-2/3 lg:w-1/3 mx-auto px-5 md:px-8">
      <form @submit.prevent="submitForm" >
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
