import { chromium, FullConfig } from '@playwright/test';
import login from './playwrightLogin';

const username = process.env.TEST_USERNAME ?? '';
const password = process.env.TEST_PASSWORD ?? '';

async function globalSetup(config: FullConfig): Promise<void> {
  const { storageState } = config.projects[0].use;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await login(page, username, password);
  await page.context().storageState({
    path: storageState as string,
  });
  await browser.close();
}

export default globalSetup;
