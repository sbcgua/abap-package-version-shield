import { defineConfig } from 'vite'

// console.log(process.env.VITEST);
// console.log(process.env.E2E_TARGET);

const is_e2e = Boolean(process.env.E2E_TARGET);
const scope = is_e2e ? {
  include: [
    'src/**/*e2e*.test.[jt]s',
  ],
} : {
  exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/*e2e*'
  ],
};

export default defineConfig({
  test: {
    environment: 'node',
    ...scope,
  },
});