import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'

dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      "/api": {
        target: `${process.env.VITE_TARGET}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js"
  }
})
