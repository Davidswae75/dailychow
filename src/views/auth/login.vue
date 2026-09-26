<script setup lang="ts">
import AuthForm, {
  type AuthFormType,
} from "@/components/site/Auth/AuthForm.vue";
import { getUserByid } from "@/firebase";
import { getError } from "@/firebase/utils/error";
import { useAuth } from "@/hooks/useAuth";
import { useUiStore } from "@/store";
import { loginSchema } from "@/types";
import { useForm } from "vee-validate";
import { defineComponent, provide, ref } from "vue";
import { useRouter } from "vue-router";

const { alert } = useUiStore();
const { signIn } = useAuth();
const router = useRouter();

const { values, setFieldValue, handleSubmit } = useForm<AuthFormType>({
  validationSchema: loginSchema,
  initialValues: {
    email: "",
    password: "",
  },
});

const loading = ref(false);
provide('loading', loading)

const submitForm = handleSubmit(async (formValues) => {
  if (!formValues) return;
  loading.value = true;
  try {
    const { uid } = await signIn(
      "login",
      formValues.email,
      formValues.password
    );
    // await getUserByid(uid);
    alert.success("Successfully Logged In");
    setTimeout(() => {
      router.push("/dashboard/home");
    }, 3000);
  } catch (error) {
    getError(error);
  } finally {
    loading.value = false;
  }
});

defineOptions({
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
