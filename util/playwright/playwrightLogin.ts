import { Page } from '@playwright/test';

async function login(
  page: Page,
  username: string,
  password: string,
): Promise<void> {
  await page.goto('http://localhost:3000/login');
  await page.locator('data-test-id=login-username').fill(username);
  await page.locator('data-test-id=login-password').fill(password);

  await Promise.all([
    page.waitForNavigation(),
    page.locator('data-test-id=login-submit').click(),
  ]);
}

export default login;
