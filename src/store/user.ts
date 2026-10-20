import type { UserProps } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

type User = UserProps | null;

export const useUserStore = defineStore("userStore", () => {
  const user = ref<User>(null);

  const setUserState = (data: User) => {
    user.value = data;
  };

  return {
    user,
    setUserState,
  };
});
