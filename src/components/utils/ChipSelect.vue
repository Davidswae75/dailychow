<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from "vue";
import Chip from "./chip.vue";

// type T = Record<string, any>

interface Props<T extends Record<string, any>> {
  options: T[];
  modelValue: T;
  labelKey?: keyof T;
  valueKey?: keyof T;
  grid?: boolean;
}

const props = defineProps<Props<T>>();
const emit = defineEmits<{
  "update:modelValue": [value: T];
}>();

const getItemValue = (item: T): string => {
  const key = props.valueKey ?? "id";
  const val = item[key] ?? item.id;
  return String(val ?? "");
};

const getItemLabel = (item: T): string => {
  if (props.labelKey != null) {
    return String(item[props.labelKey] ?? "");
  }
  return String(item.name ?? item.id ?? "No Label");
};

const mappedOptions = computed(() =>
  props.options.map((item) => ({
    label: getItemLabel(item),
    value: getItemValue(item),
    item,
  }))
);

const isSelected = (value: string): boolean => {
  return getItemValue(props.modelValue) === value;
};

const handleSelection = (value: string): void => {
  const found = props.options.find((item) => getItemValue(item) === value);
  if (found) {
    emit("update:modelValue", found);
  }
};
</script>

<template>
    <Chip
      v-for="option in mappedOptions"
      :key="option.value"
      variant="primary"
      hover
      :active="isSelected(option.value)"
      @click="handleSelection(option.value)"
    >
      <span class="z-20 relative">
        {{ option.label }}
      </span>
    </Chip>

    <!-- functions/
├── src/
│   ├── index.ts                    # Main entry point (only exports)
│   │
│   ├── config/
│   │   └── index.ts                # Firebase config, secrets, constants
│   │
│   ├── types/                      # Shared TypeScript types/interfaces
│   │   ├── user.ts
│   │   ├── post.ts
│   │   └── index.ts
│   │
│   ├── services/                   # Business logic (most important folder)
│   │   ├── user.service.ts
│   │   ├── post.service.ts
│   │   └── notification.service.ts
│   │
│   ├── triggers/                   # Firebase event triggers
│   │   ├── auth/
│   │   │   └── onUserCreate.ts
│   │   ├── firestore/
│   │   │   ├── onPostCreate.ts
│   │   │   └── onPostDelete.ts
│   │   └── storage/
│   │       └── onFileUpload.ts
│   │
│   ├── api/                        # Callable functions (client-called)
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── index.ts
│   │
│   ├── https/                      # REST endpoints (only if really needed)
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── errors.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   │
│   └── middleware/                 # (optional) auth, validation, etc.
│       └── auth.ts
│
├── package.json
├── tsconfig.json
└── .env (if using dotenv locally) 
-->
</template>