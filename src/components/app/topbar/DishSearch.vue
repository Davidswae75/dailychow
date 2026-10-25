<script setup lang="ts">
/**
 * Search trigger for the top bar plus a command palette: find any dish by name,
 * category or ingredient, or jump to a page. Opens with Ctrl/⌘ + K.
 */
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Search } from "@lucide/vue";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import DishThumb from "../dish/DishThumb.vue";
import { dishes, capitalize, dishFactsShort, navItems } from "@/lib";

const open = ref(false);
const router = useRouter();

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const shortcutLabel = computed(() => (isMac ? "⌘K" : "Ctrl K"));

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    open.value = !open.value;
  }
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

function go(to: string) {
  open.value = false;
  router.push(to);
}
</script>

<template>
  <button
    type="button"
    class="group flex size-10 items-center justify-center gap-2.5 rounded-full border border-border bg-paper/80 text-sm text-ink transition-colors hover:border-ink/40 hover:text-charcoal md:w-56 md:justify-start md:px-3.5 lg:w-64 xl:w-80"
    aria-label="Search dishes"
    @click="open = true"
  >
    <Search class="size-4 shrink-0" />
    <span class="hidden grow truncate text-left md:block">Search dishes<span class="hidden xl:inline"> or ingredients</span></span>
    <Kbd class="hidden bg-cream md:inline-flex">{{ shortcutLabel }}</Kbd>
  </button>

  <Dialog v-model:open="open">
    <DialogContent
      :show-close-button="false"
      class="top-[12dvh] max-w-[calc(100%-1.5rem)] translate-y-0 gap-0 overflow-hidden rounded-[26px] border-border bg-paper p-0 shadow-lift sm:max-w-xl"
    >
      <DialogHeader class="sr-only">
        <DialogTitle>Search Daily Chow</DialogTitle>
        <DialogDescription>Find a dish by name, category or ingredient, or jump to a page.</DialogDescription>
      </DialogHeader>
      <Command class="bg-transparent [&_[data-slot=command-input-wrapper]]:h-14 [&_[data-slot=command-input-wrapper]]:border-border [&_[data-slot=command-input-wrapper]]:px-4">
        <CommandInput
          placeholder="Jollof, swallow, plantain…"
          class="text-base"
        />
        <CommandList class="max-h-[min(60dvh,26rem)] p-2">
          <CommandEmpty class="py-10 text-center text-sm text-ink">No dish or page matches that.</CommandEmpty>

          <CommandGroup heading="Dishes">
            <CommandItem
              v-for="dish in dishes"
              :key="dish.id"
              :value="dish.id"
              class="gap-3 rounded-2xl px-2 py-2 data-[highlighted]:bg-cream data-[highlighted]:text-charcoal"
              @select="go(`/dashboard/foods/${dish.id}`)"
            >
              <DishThumb :dish="dish" class="size-10 rounded-xl" />
              <span class="flex min-w-0 grow flex-col">
                <span class="truncate font-semibold text-charcoal">{{ dish.name }}</span>
                <span class="truncate text-xs text-ink">{{ capitalize(dish.category) }} · {{ dishFactsShort(dish) }}</span>
              </span>
              <!-- Hidden text so ingredients and sides are searchable too -->
              <span class="sr-only">{{ dish.ingredients.join(" ") }} {{ dish.sides.join(" ") }}</span>
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Go to">
            <CommandItem
              v-for="item in navItems"
              :key="item.to"
              :value="item.to"
              class="gap-3 rounded-2xl px-2 py-2.5 data-[highlighted]:bg-cream data-[highlighted]:text-charcoal"
              @select="go(item.to)"
            >
              <span class="grid size-10 place-items-center rounded-xl bg-cream">
                <component :is="item.icon" class="size-[18px] text-terracotta-deep!" />
              </span>
              <span class="font-semibold text-charcoal">{{ item.name }}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>
