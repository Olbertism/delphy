import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:3000/';

test('add and delete a claim', async ({ page }) => {
  await page.goto(baseUrl + 'database/contribute');
  await expect(page).toHaveURL(`${baseUrl}database/contribute`);
  await expect(page.locator('data-test-id=add-claim-h1')).toHaveText(
    'Add a claim to the database',
  );

  await page.locator('data-test-id=claim-title').fill('Playwright Test Claim');
  await page
    .locator('data-test-id=claim-description')
    .fill('Playwright Test Claim Description');

  await page.locator('data-test-id=claim-label-input').fill('Playwright');
  await page.locator('data-test-id=claim-save-label').click();

  await page.locator('data-test-id=claim-submit-btn').click();

  // after creation
  await page.goto(baseUrl + `users/${process.env.TEST_USERNAME}`);
  await expect(page).toHaveURL(`${baseUrl}users/${process.env.TEST_USERNAME}`);
  await expect(page.locator('data-test-id=profile-h1')).toHaveText(
    'Profile page',
  );

  const claimLink = page.locator('data-test-id=link-to-Playwright Test Claim');
  await expect(claimLink).toHaveText('Go to claim');
  await claimLink.click();
  await expect(page.locator('data-test-id=claim-h1')).toHaveText(
    'Playwright Test Claim',
  );
  const deleteButton = page.locator('data-test-id=delete-btn');
  await deleteButton.click();
  const confirmButton = page.locator('data-test-id=confirm-btn');
  await confirmButton.click();
});
