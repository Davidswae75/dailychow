import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
    const isLoggedIn = ref(false)

    const changeLoggedInStatus = (state: boolean) => {
        isLoggedIn.value = state
    }

    return {
        isLoggedIn,
        changeLoggedInStatus
    }
    
})