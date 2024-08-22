import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    rollupOptions: {
      input: "./index.html",
    },
  },
  server: {
    port: 3007,
    proxy: {
      "/api": {
        target: "http://localhost:8355",
        changeOrigin: true,
        secure: false,
      },
    },
    // Elimina las opciones hmr y https
  },
});
