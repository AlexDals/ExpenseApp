import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://uxhdokrbezwyftllsohx.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4aGRva3JiZXp3eWZ0bGxzb2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0Nzc1MjcsImV4cCI6MjA2NTA1MzUyN30.IiJZS7_PX_swPXXDWtQrIWx0kIvKMUVm4T8MK5LuQOQ')
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  }
});