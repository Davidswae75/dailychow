<script setup lang="ts">
import AuthForm, {
  type AuthFormType,
} from "@/components/site/Auth/AuthForm.vue";
import { getUserByid } from "@/firebase";
import { getError } from "@/firebase/utils/error";
import { useAuth } from "@/composables/useAuth";
import { loginSchema } from "@/types";
import { useForm } from "vee-validate";
import { provide, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Reveal from "@/components/utils/Reveal.vue";
import heroSpread from "@/assets/hero-spread.jpg";

const toast = useToast()
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
    toast.success("Successfully Logged In");
    router.push("/dashboard/home");
    // setTimeout(() => {
    // }, 3000);
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
  <main class="relative min-h-screen bg-cream grain flex items-center overflow-hidden">
    <!-- Food photo behind the frosted card -->
    <div class="absolute inset-0 -z-0 pointer-events-none" aria-hidden="true">
      <img :src="heroSpread" alt="" class="size-full object-cover animate-drift opacity-70" />
      <div class="absolute inset-0 bg-linear-to-b from-cream/30 via-cream/50 to-cream/90"></div>
    </div>
    <Reveal class="relative w-full sm:w-2/3 lg:w-1/3 mx-auto px-5 md:px-8" :delay="0.1" :distance="24">
    <section>
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
    </Reveal>
  </main>
</template>
