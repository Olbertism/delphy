import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('visit most important pages', async ({ page }) => {
  await page.goto(baseUrl + 'dashboard');
  await expect(page).toHaveURL(`${baseUrl}dashboard`);
  await expect(page.locator('data-test-id=dashboard-h1')).toHaveText(
    'Check Claim',
  );

  await page.goto(baseUrl + 'database');
  await expect(page).toHaveURL(`${baseUrl}database`);
  await expect(page.locator('data-test-id=database-h1')).toHaveText(
    'Browse the database',
  );

  await page.goto(baseUrl + 'database/contribute');
  await expect(page).toHaveURL(`${baseUrl}database/contribute`);
  await expect(page.locator('data-test-id=add-claim-h1')).toHaveText(
    'Add a claim to the database',
  );

  await page.goto(baseUrl + 'database/contribute-review');
  await expect(page).toHaveURL(`${baseUrl}database/contribute-review`);
  await expect(page.locator('data-test-id=add-review-h1')).toHaveText(
    'Add a review to the database',
  );
});
