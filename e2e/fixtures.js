import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page }, use) => {
    const pageErrors = [];

    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.addInitScript(() => {
      window.__pageErrors = [];
      window.addEventListener('error', (event) => window.__pageErrors.push(event.message));
      window.addEventListener('unhandledrejection', (event) => window.__pageErrors.push(String(event.reason)));
    });

    await use(page);

    const windowErrors = await page.evaluate(() => window.__pageErrors || []);

    expect(pageErrors, 'uncaught page errors').toEqual([]);
    expect(windowErrors, 'window error events').toEqual([]);
  },
});

export { expect };

export async function visit(page, suite) {
  await page.goto(suite ? `?suite=${suite}` : '');
  await page.waitForFunction(() => window.demo);
  // Readmore re-measures every block 100 ms after `load` (debounced), which would undo a click made before it runs.
  await page.waitForLoadState('load');
  await page.waitForTimeout(150);
}
