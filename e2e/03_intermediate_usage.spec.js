/*

Feature: Intermediate Readmore.js usage
  As a developer, sometimes I need a bit more control over the behavior of Readmore.js.

  ✔︎ Scenario: 'embedCSS: false' option
    Given a Readmore.js instance configured with 'embedCSS: false'
    When Readmore.js is instantiated
    Then Readmore.js did not insert its CSS

  ✔︎ Scenario: 'blockCSS' option
    Given a Readmore.js instance configured with 'blockCSS' that sets the background of blocks to red
    When Readmore.js is instantiated on 'article' elements
    Then 'article' elements have a red background

  ✔︎ Scenario: 'startOpen' option
    Given a Readmore.js instance configured with 'startOpen: true'
    When Readmore.js is instantiated on 'article' elements
    Then all 'article' elements are expanded
    And the first toggle link is a 'lessLink'

  ✔︎ Scenario: 'sourceOrder' option
    Given a Readmore.js instance configured with 'sourceOrder: 'before''
    When Readmore.js is instantiated on 'article' elements
    Then the next sibling of the first "Read more" link is the first article

*/
import { expect, test, visit } from './fixtures.js';
import { macbook15 } from './viewports.js';

test.describe('Intermediate Readmore.js usage', () => {
  test.use({ viewport: macbook15 });

  test.describe('`embedCSS: false` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'embedCSS');
    });

    test('does not insert CSS block', async ({ page }) => {
      const css = await page.evaluate(() =>
        [...document.querySelectorAll('head style')].map((node) => node.textContent).join('\n'),
      );

      expect(css).not.toContain('article + [data-readmore-toggle]');
    });
  });

  test.describe('`blockCSS` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'blockCSS');
    });

    test('applies custom block styles to Readmore blocks', async ({ page }) => {
      // getComputedStyle returns colors in rgb, regardless of original form
      await expect(page.locator('#rmjs-2')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    });
  });

  test.describe('`startOpen` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'startOpen');
    });

    test('leaves all articles expanded', async ({ page }) => {
      await expect(page.locator('article:nth-of-type(2)')).toHaveAttribute('aria-expanded', /.*/);
      await expect(page.locator('[data-readmore-toggle="rmjs-1"]')).toContainText('Close');
    });
  });

  test.describe('`sourceOrder: "before"` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'sourceOrder');
    });

    test('inserts the toggle before its corresponding block', async ({ page }) => {
      const siblings = page.locator('[data-readmore-toggle="rmjs-1"]').locator('xpath=..').locator('> *');

      await expect(siblings.nth(0)).toHaveAttribute('data-readmore-toggle', 'rmjs-1');
      await expect(siblings.nth(3)).toContainText('Portland Leggings');
    });
  });
});
