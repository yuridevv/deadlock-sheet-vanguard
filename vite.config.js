import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // O "base" deve ser EXATAMENTE o nome do repositório no GitHub entre barras
  base: "/deadlock-sheet-vanguard/", 
})