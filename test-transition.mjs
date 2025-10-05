import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
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
    console.log('→ Navigating to card selection...');
    await page.click('text="Draw a Card"');
    await page.waitForTimeout(2000);
    await page.click('text="I\'m already centered"');
    await page.waitForTimeout(3000);
    
    console.log('→ Clicking a card to trigger transition...');
    // Click a card
    await page.locator('canvas').click({ position: { x: 400, y: 300 } });
    
    console.log('→ Waiting for transition animation (1.5s)...');
    await page.waitForTimeout(1500);
    
    await page.screenshot({ path: '/tmp/transition-test.png', fullPage: true });
    
    console.log('✓ Transition complete - screenshot saved');
    if (errors.length > 0) {
      console.log('✗ Errors:\n  ' + errors.join('\n  '));
    } else {
      console.log('✓ No console errors');
    }
  } catch (e) {
    console.log('✗ Test failed:', e.message);
    await page.screenshot({ path: '/tmp/error.png' });
  }

  await browser.close();
})();
