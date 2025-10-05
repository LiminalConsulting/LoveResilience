import { test, expect } from '@playwright/test';

/**
 * E2E tests for Love Resilience Card Deck
 * Tests core user journeys and visual appearance
 */

test.describe('Card Deck Loading', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for 3D scene to initialize
    await page.waitForLoadState('networkidle');

    // Check that canvas element exists (R3F renders to canvas)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('should display card deck in 3D space', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Allow time for 3D rendering

    // Take screenshot for visual regression
    await expect(page).toHaveScreenshot('card-deck-initial.png', {
      maxDiffPixels: 100
    });
  });
});

test.describe('Card Interaction', () => {
  test('should allow user to draw a card', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Click on canvas to interact with 3D scene
    const canvas = page.locator('canvas');
    await canvas.click({ position: { x: 400, y: 300 } });

    // Wait for any card animation
    await page.waitForTimeout(1000);

    // Verify interaction occurred (screenshot comparison)
    await expect(page).toHaveScreenshot('card-drawn.png', {
      maxDiffPixels: 100
    });
  });
});

test.describe('Visual Appearance', () => {
  test('should match design aesthetic', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Full page screenshot for design review
    await expect(page).toHaveScreenshot('full-app-view.png', {
      fullPage: true,
      maxDiffPixels: 150
    });
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('mobile-view.png', {
      maxDiffPixels: 100
    });
  });
});

test.describe('Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});
