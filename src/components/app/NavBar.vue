<script setup lang="ts">
import { Bell, Search } from "@lucide/vue";
import { storeToRefs } from "pinia";
import Logo from "../site/Logo.vue";
import UserAvatar from "./common/UserAvatar.vue";
import { useUserStore } from "@/store";

const { user } = storeToRefs(useUserStore());
</script>

<template>
  <header
    class="h-16 sticky top-0 z-30 bg-cream/90 backdrop-blur-md flex items-center border-b border-border px-5 md:px-8"
  >
    <div class="flex items-center gap-3 w-full">
      <Logo name="" bg size="md" class="md:hidden" />
      <RouterLink
        to="/dashboard/foods"
        class="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-paper px-4 text-sm text-ink transition-colors hover:text-charcoal"
      >
        <Search class="size-4" /> Search foods
      </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          class="grid size-10 place-items-center rounded-full text-olive transition-colors hover:bg-muted"
        >
          <Bell class="size-5" />
        </button>
        <RouterLink to="/dashboard/preferences" aria-label="Your preferences" class="rounded-full">
          <UserAvatar :name="user?.fullName" size="sm" />
        </RouterLink>
      </div>
    </div>
  </header>
</template>
