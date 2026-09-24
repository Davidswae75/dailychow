import type { UserProps } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

const useUserStore = defineStore('userStore', () => {
    const user = ref<UserProps | null>(null)


    return {
        user
    }
})