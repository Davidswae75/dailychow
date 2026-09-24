import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('authStore', () => {
    const loading = ref(false)

    const changeLoading = () => {
        loading.value = !loading.value
        console.log(loading.value)
    }


    return {
        loading,
        changeLoading
    }
    
})