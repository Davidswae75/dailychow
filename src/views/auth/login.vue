<script setup lang="ts">
import AuthForm, {
  type AuthFormType,
} from "@/components/site/Auth/AuthForm.vue";
import { auth, getError } from "@/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/composables/useAuth";
import { useAuthStore } from "@/store";
import { loginSchema } from "@/types";
import { useForm } from "vee-validate";
import { provide, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import Reveal from "@/components/utils/Reveal.vue";
import heroSpread from "@/assets/hero-spread.webp";

const toast = useToast()
const { signIn } = useAuth();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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
    await signIn(formValues.email, formValues.password);
    if (!authStore.isLoggedIn) {
      toast.error("We couldn't find your profile. Please register again.");
      await signOut(auth);
      return;
    }
    toast.success("Successfully Logged In");
    router.push((route.query.redirect as string) || "/dashboard/home");
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
