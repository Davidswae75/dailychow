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
import Logo from "@/components/site/Logo.vue";

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
  <main class="min-h-dvh bg-cream flex flex-col md:items-center md:justify-center md:p-8 bg-paper">
    <!-- Mobile: photo header with the form as a bottom sheet. Desktop: one centered card. -->
    <div
      class="flex flex-1 flex-col w-full md:flex-none md:max-w-md md:rounded-4xl md:overflow-hidden md:border md:border-line md:shadow-lift"
    >
      <header
        class="relative h-[34dvh] min-h-52 md:h-44 md:min-h-0 shrink-0 overflow-hidden"
      >
        <img
          :src="heroSpread"
          alt=""
          class="absolute inset-0 size-full object-cover"
        />
        <div
          class="absolute inset-0 bg-linear-to-b from-charcoal/40 via-transparent to-charcoal/30"
        ></div>
        <Logo
          size="md"
          :bg="true"
          :name="''"
          containerClass="absolute left-5 top-[max(1.25rem,env(safe-area-inset-top))] cursor-pointer"
          @click="$router.push('/')"
        />
      </header>

      <Reveal
        class="relative -mt-8 flex-1 rounded-t-4xl bg-paper px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:mt-0 md:rounded-none md:px-8"
        :delay="0.1"
        :distance="24"
      >
        <div
          class="mx-auto mb-6 h-1.5 w-10 rounded-full bg-line md:hidden"
          aria-hidden="true"
        ></div>
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
      </Reveal>
    </div>
  </main>
</template>
