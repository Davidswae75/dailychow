<script setup lang="ts">
import HeaderText from "@/components/landing/HeaderText.vue";
import Logo from "@/components/site/Logo.vue";
import Button from "@/components/ui/button/Button.vue";
import Fields, { type FieldsProp } from "@/components/utils/Fields.vue";
import { Eye, EyeClosed } from "@lucide/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { Form } from "vee-validate";
import { computed, reactive, ref } from "vue";
import * as z from "zod";

const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Enter a valid email address" }),
    password: z.string().min(1, "Password is required"),
  })
);

const form = reactive({
  email: "",
  password: "",
});

const onSubmit = (values: any) => {
  console.log(values);
};

const pV = ref(false);

const fields = computed<FieldsProp["fields"]>(() => [
  {
    label: "Email",
    fieldType: "input",
    name: "email",
    attrs: {
      placeholder: "your@email.com",
    },
  },
  {
    label: "Password",
    fieldType: "input",
    secondLabel: {
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
  },
]);
</script>

<template>
  <main class="min-h-screen flex justify-center items-center grain bg-cream">
    <section class="space-y-7 lg:w-1/4 md:w-2/4 w-4/5">
      <Logo />
      <section
        class="border border-line p-4 md:p-7 bg-paper rounded-4xl space-y-3"
      >
        <HeaderText
          eyebrow=""
          title="Welcome back"
          description="Tonight's pick is already thinking about you."
          titleClass="text-xl md:text-3xl"
        />

        <Form
          class="space-y-4"
          @submit="onSubmit"
          :validationSchema="loginSchema"
        >
          <Fields :form="form" :fields="fields">
            <template #password:append-icon>
              <div @click="pV = !pV">
                <Eye v-if="pV" class="size-5 text-muted-foreground" />
                <EyeClosed v-else class="size-5 text-muted-foreground" />
              </div>
            </template>
          </Fields>

          <Button block="full" variant="terracotta" size="2xl" type="submit">
            Sign In
          </Button>
        </Form>

        <p
          class="text-muted-foreground text-sm text-center inline-flex items-center flex-wrap"
        >
          New here?
          <Button
            to="/onboarding/registration"
            class="text-terracotta inline w-1/5 bg-transparent hover:bg-transparent hover:underline"
            >Answer 5 quick questions to start</Button
          >
        </p>
      </section>
    </section>
  </main>
</template>
