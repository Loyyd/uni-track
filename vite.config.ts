import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` to your repository name for GitHub Pages project site
export default defineConfig({
  base: '/university_grade_tracker/',
  plugins: [react()],
})
