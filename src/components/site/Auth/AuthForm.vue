<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Logo from "@/components/site/Logo.vue";
import Button from "@/components/ui/button/Button.vue";
import Fields, { type FieldsProp } from "@/components/utils/Fields.vue";
import { initUser } from "@/firebase/services/user";
import type { RegisterSchemaType, UserProps } from "@/types";
import { Eye, EyeClosed } from "@lucide/vue";

import { computed, ref } from "vue";

interface Props {
  mode: "login" | "register";
  form: RegisterSchemaType;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "login",
});

// const loginSchema =

const pV = ref(false);

const fields = computed<FieldsProp["fields"]>(() => [
  ...(props.mode === "register"
    ? [
        {
          label: "FullName",
          fieldType: "input",
          name: "fullName",
          inputClass: "bg-paper",
          attrs: {
            placeholder: "your fullName",
          },
        } as FieldsProp["fields"][number],
      ]
    : []),
  {
    label: "Email",
    fieldType: "input",
    name: "email",
    inputClass: props.mode == "register" && "bg-paper",
    attrs: {
      placeholder: "your@email.com",
    },
  } as FieldsProp["fields"][number],
  {
    label: "Password",
    fieldType: "input",
    inputClass: props.mode == "register" && "bg-paper",
    secondLabel: props.mode == "login" && {
      label: "Forgot Password",
      labelAction() {
        console.log("second label action");
      },
      labelClass: "hover:underline",
    },
    name: "password",
    attrs: {
      placeholder: "your password",
      type: pV.value ? "text" : "password",
    },
  } as FieldsProp["fields"][number],
]);
</script>

<template>
  <main class="h-full flex justify-center items-center grain bg-cream w-full">
    <section class="space-y-7 w-full">
      <Logo v-if="mode == 'login'" />
      <section
        class="p-4 md:p-7 rounded-4xl space-y-3"
        :class="mode == 'login' && 'bg-paper border border-line'"
      >
        <HeaderText
          :eyebrow="props.mode == 'register' ? 'SAVE YOUR PLATE' : ''"
          :title="
            props.mode == 'login' ? 'Welcome back' : 'Create your account'
          "
          :description="
            props.mode == 'login'
              ? 'Tonights pick is already thinking about you.'
              : 'Your answers are ready. One quick account and tonights dish is yours.'
          "
          titleClass="text-xl md:text-3xl"
        />

        <Fields :form="form" :fields="fields">
          <template #password:append-icon>
            <div @click="pV = !pV">
              <Eye v-if="pV" class="size-5 text-muted-foreground" />
              <EyeClosed v-else class="size-5 text-muted-foreground" />
            </div>
          </template>
        </Fields>

        <Button block="full" variant="terracotta" size="2xl" type="submit">
          {{
            props.mode == "login"
              ? "Sign In"
              : "Create an account & see my dish"
          }}
        </Button>

        <div>
          <p class="text-muted-foreground text-sm text-center">
            {{
              props.mode == "login" ? "New Here?" : "Already have an account"
            }}
          </p>
          <Button
            :to="
              props.mode == 'login' ? '/onboarding/registration' : '/sign-in'
            "
            class="text-terracotta bg-transparent hover:bg-transparent hover:underline break-all text-center w-full"
            >{{
              props.mode == "login"
                ? "Answer 5 quick questions to start"
                : "Sign in"
            }}</Button
          >
        </div>
      </section>
    </section>
  </main>
</template>
