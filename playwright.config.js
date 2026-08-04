import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',

  use: {
    // Override with: BASE_URL=http://127.0.0.1:5500 npx playwright test
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:5500',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});