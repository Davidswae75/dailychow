import { createApp } from "vue";
import "./assets/styles.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./assets/toast.css";
import { registerSW } from "virtual:pwa-register";

// Check for a new service worker on an interval and whenever the PWA is reopened,
// then reload so the latest deploy is shown.
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;
    const update = () => registration.update().catch(() => {});
    setInterval(update, 60 * 1000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") update();
    });
  },
});

const toastOptions: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
};

const pinia = createPinia();
createApp(App).use(Toast, toastOptions).use(pinia).use(router).mount("#app");
