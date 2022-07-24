import { devices, PlaywrightTestConfig } from '@playwright/test';
// import dotenv from 'dotenv';
import dotenv from 'dotenv-safe';

dotenv.config();

const config: PlaywrightTestConfig = {
  globalSetup: './util/playwright/global-setup',
  webServer: {
    command: 'yarn start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  testIgnore: '**/util/__tests__/**',
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'list' : 'html',
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    storageState: 'util/playwright/storage-state/storageState.json',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  outputDir: 'test-results/',
};
export default config;
