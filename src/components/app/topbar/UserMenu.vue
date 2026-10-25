<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { ChevronDown, Clock, LogOut, Settings } from "@lucide/vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "../common/UserAvatar.vue";
import { useUserStore } from "@/store";
import { useAuth } from "@/composables/index.ts";

/** Avatar button with account shortcuts. */
const { user } = storeToRefs(useUserStore());
const { signOutUser } = useAuth();
const firstName = computed(() => user.value?.fullName?.split(" ")[0] ?? "Account");

const links = [
  { label: "Preferences", to: "/dashboard/preferences", icon: Settings },
  { label: "History", to: "/dashboard/history", icon: Clock },
];
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      class="group flex items-center gap-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-deep xl:border xl:border-border xl:bg-paper/80 xl:py-0.5 xl:pr-3 xl:pl-0.5 xl:hover:border-ink/40"
      aria-label="Account menu"
    >
      <UserAvatar :name="user?.fullName" size="sm" class="transition-transform group-hover:scale-105 xl:group-hover:scale-100" />
      <span class="hidden max-w-28 truncate text-sm font-semibold text-charcoal xl:block">{{ firstName }}</span>
      <ChevronDown class="hidden size-4 text-ink transition-transform group-data-[state=open]:rotate-180 xl:block" />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :side-offset="10" class="w-60 rounded-[20px] border-border bg-paper p-1.5 shadow-lift">
      <DropdownMenuLabel class="flex items-center gap-3 px-2 py-2">
        <UserAvatar :name="user?.fullName" size="sm" />
        <span class="flex min-w-0 flex-col">
          <span class="truncate font-semibold text-charcoal">{{ user?.fullName ?? "Guest" }}</span>
          <span class="truncate text-xs font-normal text-ink">{{ user?.email ?? "Not signed in" }}</span>
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator class="bg-border" />
      <DropdownMenuItem v-for="link in links" :key="link.to" as-child class="rounded-xl px-2.5 py-2.5">
        <RouterLink :to="link.to">
          <component :is="link.icon" />
          {{ link.label }}
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuSeparator class="bg-border" />
      <DropdownMenuItem class="rounded-xl px-2.5 py-2.5" @select="signOutUser()">
        <LogOut />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
