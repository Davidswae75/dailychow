<script setup lang="ts">
import { useUiStore, type Alert, type AlertPosition } from "@/store/ui";
import { AnimatePresence, motion } from "motion-v";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "@lucide/vue";
import { computed } from "vue";
import { storeToRefs } from "pinia";

const store = useUiStore();
const { alerts } = storeToRefs(store);
const { removeAlert } = store;

const iconMap = {
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
};

const typeConfig: Record<
  Alert["type"],
  { container: string; accent: string; progress: string }
> = {
  info: {
    container: "bg-cream border-line/50",
    accent: "bg-olive",
    progress: "bg-olive/65",
  },
  success: {
    container: "bg-paper border-saffron/20",
    accent: "bg-saffron",
    progress: "bg-saffron",
  },
  warning: {
    container: "bg-cream border-terracotta/20",
    accent: "bg-terracotta",
    progress: "bg-terracotta",
  },
  error: {
    container: "bg-paper border-terracotta-deep/25",
    accent: "bg-terracotta-deep",
    progress: "bg-terracotta-deep",
  },
};

const groupedAlerts = computed(() => {
  const groups: Record<AlertPosition, Alert[]> = {
    top: [],
    "top-left": [],
    "top-right": [],
    bottom: [],
    "bottom-left": [],
    "bottom-right": [],
  };

  alerts.value.forEach((a) => {
    const pos = a.position ?? "top";
    groups[pos].push(a);
  });

  return groups;
});

// Mobile-friendly positioning
const positionClasses: Record<AlertPosition, string> = {
  top: "top-[max(1rem,env(safe-area-inset-top))] left-0 right-0 flex flex-col items-center gap-2.5 px-3",
  "top-left": "top-[max(1rem,env(safe-area-inset-top))] left-4 flex flex-col items-start gap-2.5",
  "top-right": "top-[max(1rem,env(safe-area-inset-top))] right-4 flex flex-col items-end gap-2.5",
  bottom: "bottom-[max(1rem,env(safe-area-inset-bottom))] left-0 right-0 flex flex-col items-center gap-2.5 px-3",
  "bottom-left": "bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 flex flex-col items-start gap-2.5",
  "bottom-right": "bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 flex flex-col items-end gap-2.5",
};

const positions = Object.keys(positionClasses) as AlertPosition[];
</script>

<template>
  <div
    v-for="position in positions"
    :key="position"
    class="fixed z-[9999] pointer-events-none"
    :class="positionClasses[position]"
  >
    <AnimatePresence>
      <motion.div
        v-for="alert in groupedAlerts[position].slice(0, 5)"
        :key="alert.id"
        :initial="{
          opacity: 0,
          y: position.startsWith('bottom') ? 16 : -16,
          filter: 'blur(10px)',
          scale: 0.985,
        }"
        :animate="{
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
        }"
        :exit="{
          opacity: 0,
          y: position.startsWith('bottom') ? 8 : -8,
          filter: 'blur(5px)',
          scale: 0.985,
        }"
        :transition="{
          type: 'spring',
          stiffness: 700,
          damping: 20,
        }"
        class="pointer-events-auto w-full max-w-[340px] border rounded-3xl overflow-hidden shadow-sm"
        :class="typeConfig[alert.type].container"
      >
        <!-- ... rest of the alert content stays the same ... -->
        <div class="flex gap-3 p-3.5">
          <!-- icon + content -->
          <div class="flex items-start gap-2.5">
            <div
              class="w-1 self-stretch rounded-full mt-0.5"
              :class="typeConfig[alert.type].accent"
            />
            <div
              class="h-6.5 w-6.5 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-black/5"
              :class="typeConfig[alert.type].accent"
            >
              <component
                :is="iconMap[alert.type]"
                :size="14"
                class="text-paper"
              />
            </div>
          </div>

          <div class="flex-1 min-w-0 pt-0.5 pr-0.5">
            <div class="flex items-start justify-between gap-x-2">
              <div class="min-w-0">
                <p
                  v-if="alert.title"
                  class="font-semibold text-[14.5px] leading-snug text-charcoal tracking-[-0.01em]"
                >
                  {{ alert.title }}
                </p>
                <p
                  class="text-[13px] leading-[1.4] text-ink-muted mt-0.5 pr-1"
                  :class="{ 'mt-1': !alert.title }"
                >
                  {{ alert.message }}
                </p>
              </div>

              <button
                type="button"
                class="text-ink-muted/50 hover:text-ink-muted transition-colors shrink-0 -mr-0.5 mt-0.5"
                @click="removeAlert(alert.id)"
              >
                <X :size="13" stroke-width="3" />
              </button>
            </div>

            <button
              v-if="alert.action"
              type="button"
              class="mt-2 text-xs font-semibold text-terracotta hover:text-terracotta-deep underline-offset-2 hover:underline"
              @click="
                alert.action?.onClick();
                removeAlert(alert.id);
              "
            >
              {{ alert.action.label }}
            </button>
          </div>
        </div>

        <div
          v-if="!alert.persistent"
          class="h-px w-full bg-black/5 relative overflow-hidden"
        >
          <div
            class="absolute left-0 top-0 h-px alert-progress"
            :class="typeConfig[alert.type].progress"
            :style="{
              animationDuration: `${alert.duration ?? 4200}ms`,
            }"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<style scoped>
.alert-progress {
  width: 100%;
  transform-origin: left center;
  animation-name: alert-shrink;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes alert-shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>