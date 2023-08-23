import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4200,
    host: "localhost",
  },
  plugins: [react()],
});
