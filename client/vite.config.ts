import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
//import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  //plugins: [react(), tsconfigPaths()],
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@src',
        replacement: path.resolve(path.join(__dirname, '/src')),
      },
    ],
  },
});
