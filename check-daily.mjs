import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  await page.goto('http://localhost:5174/LoveResilience/');
  await page.waitForTimeout(2000);

  try {
    // Click "Card of the Day"
    await page.click('text="Card of the Day"', { timeout: 5000 });
    await page.waitForTimeout(5000); // Wait for animation and card loading
    
    await page.screenshot({ path: '/tmp/daily-test.png', fullPage: true });
    
    console.log('✓ Screenshot saved');
    if (errors.length > 0) {
      console.log('✗ Errors:\n  ' + errors.join('\n  '));
    } else {
      console.log('✓ No console errors');
    }
  } catch (e) {
    console.log('✗ Navigation failed:', e.message);
    await page.screenshot({ path: '/tmp/error.png' });
  }

  await browser.close();
})();
