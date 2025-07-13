import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@mui/styled-engine': path.resolve(__dirname, 'node_modules/@mui/styled-engine-sc')
    }
	},
  ssr: {
    noExternal: ['primereact'],
  }
});
