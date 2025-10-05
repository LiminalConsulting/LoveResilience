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
    // Click "Draw a Card"
    await page.click('text="Draw a Card"', { timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Click "I'm already centered"
    await page.click('text="I\'m already centered"', { timeout: 5000 });
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: '/tmp/selection-test.png', fullPage: true });
    
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
