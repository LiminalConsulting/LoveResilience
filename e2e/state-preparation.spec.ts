import { test, expect } from '@playwright/test';

/**
 * E2E tests for state preparation flow
 * The "digital temple" entry experience
 */

test.describe('State Preparation Flow', () => {
  test('should show greeting/entry screen', async ({ page }) => {
    await page.goto('/');

    // Check for any initial greeting or preparation UI
    // This will be implemented as the feature develops
    await page.waitForTimeout(2000);

    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should transition to main deck after preparation', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);

    // Eventually this will test:
    // 1. Greeting screen appears
    // 2. User centers themselves
    // 3. Transition to card deck

    // For now, verify smooth loading
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});

test.describe('Centering Experience', () => {
  test('should provide space for user to center', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Future: test breathing exercise, check-in prompts, etc.
    // For now: verify app loads smoothly
    const hasError = await page.locator('text=Error').isVisible().catch(() => false);
    expect(hasError).toBe(false);
  });
});
