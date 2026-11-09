import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const componentesRestritos = fileURLToPath(new URL('../crowdacademico/react/src', import.meta.url));

function arquivosPublicos() {
  return {
    name: 'arquivos-publicos',
    apply: 'build',
    closeBundle() {
      const destinoImagens = resolve('dist/imagens');
      const destinoVendor = resolve('dist/vendor');
      mkdirSync(destinoImagens, { recursive: true });
      mkdirSync(destinoVendor, { recursive: true });
      cpSync(resolve('imagens'), destinoImagens, { recursive: true });
      cpSync(resolve('vendor/tailwind.js'), resolve(destinoVendor, 'tailwind.js'));
    },
  };
}

export default defineConfig({
  plugins: [react(), arquivosPublicos()],
  resolve: {
    alias: {
      '@restrita': componentesRestritos,
    },
  },
});
