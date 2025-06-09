import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('https://uxhdokrbezwyftllsohx.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('YOUR_ANON_KEY')
  }
});