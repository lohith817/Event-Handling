// vite.config.js — Vite config with React plugin
// The proxy forwards /api/* calls to the backend during development
// so you don't need to hardcode http://localhost:5000 in every fetch.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // All /api requests go to the Express backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
