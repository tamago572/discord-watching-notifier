import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { crx } from "@crxjs/vite-plugin"
import manifest from "./manifest.json"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  server: command === "serve"
    ? {
        host: "127.0.0.1",
        port: 5173,
        strictPort: true,
        cors: true,
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    : undefined,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    crx({ manifest })
  ],
}))
