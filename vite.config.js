import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Define base para ambientes de produção (ex.: GitHub Pages) e dev local
  base: process.env.NODE_ENV === 'production' ? '/TCC-oficial/' : '/',
});