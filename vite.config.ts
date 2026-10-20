import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      // Our own service worker (src/sw.ts) so it can include Firebase Cloud Messaging
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,gif,woff2}"],
      },
      manifest: {
        name: "Daily Chow",
        short_name: "Daily Chow",
        description: "Decide what to eat today. Nigerian meal picks, planning and history in one place.",
        start_url: "/dashboard/home",
        scope: "/",
        display: "standalone",
        background_color: "#f7f1e8",
        theme_color: "#c45c26",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
