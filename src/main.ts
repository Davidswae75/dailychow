import { createApp } from "vue";
import "./assets/styles.css";
import 'animate.css'
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";


const options = {
    position:'top-right',
    timeOut : 3000,
}

const pinia = createPinia()
createApp(App).use(Toast, options).use(pinia).use(router).mount("#app");
