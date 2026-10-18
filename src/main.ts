import { createApp } from "vue";
import "./assets/styles.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./assets/toast.css";

const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
};

const pinia = createPinia();
createApp(App).use(Toast, toastOptions).use(pinia).use(router).mount("#app");
