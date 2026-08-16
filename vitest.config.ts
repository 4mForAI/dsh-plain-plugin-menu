import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environmentMatchGlobs: [['**/*.client.spec.tsx', 'jsdom']],
  },
})
