import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('page test', async ({ page }) => {
  // go to first product page, add product to cart
  await page.goto(baseUrl + 'dashboard');

  await expect(page).toHaveURL(`${baseUrl}dashboard`);
});
