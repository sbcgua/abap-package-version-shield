import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/*e2e*'
    ],
  },
})