/*

Feature: Basic Readmore.js usage
  As a developer, I need to be able to configure Readmore.js to suit my application.

  ✔︎ Scenario: Basic instantiation
    Given a page with content
    When Readmore.js is instantiated on 'article' elements, with no custom configuration
    Then all article elements taller than 200px are collapsed
    And all article elements shorter than 200px remain untouched

  ✔︎ Scenario: Basic operation with default configuration
    Given a Readmore.js instance with no custom configuration
    When the user clicks the first "Read more" link
    Then the first content block is expanded

  ✔︎ Scenario: Default configuration respects max-height CSS
    Given a page with content
    And the page CSS specifies a max-height of 300px for 'article' elements
    When Readmore.js is instantiated on 'article' elements
    Then all article elements taller than 300px are collapsed
    And all article elements shorter than 300px remain untouched

  ✔︎ Scenario: Basic custom configuration
    Given a Readmore.js instance with custom configuration for 'speed' and 'collapsedHeight'
    When Readmore.js is instantiated on 'article' elements
    Then all article elements taller than 'collapsedHeight' are collapsed
    And all article elements shorter than 'collapsedHeight' remain untouched
    And `article[data-readmore]` elements should have a 'transition: height ${speed}s' CSS property

*/
import { expect, test, visit } from './fixtures.js';
import { macbook15 } from './viewports.js';

test.describe('Basic Readmore.js usage', () => {
  test.use({ viewport: macbook15 });

  test.describe('Basic instantiation', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page);
      await page.locator('[data-readmore-toggle="rmjs-1"]').click();
    });

    test('sets aria-expanded on the toggle after a click', async ({ page }) => {
      await expect(page.locator('[aria-controls="rmjs-1"]')).toHaveAttribute('aria-expanded', 'true');
    });

    test('leaves elements shorter than 200px untouched', async ({ page }) => {
      await expect(page.locator('article:nth-of-type(3) + [data-readmore-toggle]')).toHaveCount(0);
    });
  });

  test.describe('Default configuration respects max-height CSS', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'max-height');
      await page.locator('[data-readmore-toggle="rmjs-1"]').click();
    });

    test('sets aria-expanded on the toggle after a click under a CSS max-height', async ({ page }) => {
      await expect(page.locator('[aria-controls="rmjs-1"]')).toHaveAttribute('aria-expanded', 'true');
    });

    test('leaves elements shorter than 300px untouched', async ({ page }) => {
      await expect(page.locator('article:nth-of-type(3) + [data-readmore-toggle]')).toHaveCount(0);
    });
  });

  test.describe('Basic custom configuration', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'basic');
    });

    test('collapses all elements taller than 384px', async ({ page }) => {
      await expect(page.locator('[aria-controls="rmjs-1"]')).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator('#rmjs-1')).toHaveCSS('height', '384px');
    });

    test('readmore elements should have a `transition: height .56s` CSS property', async ({ page }) => {
      // The computed value is browser-specific (`height 0.56s ease 0s` in Chromium), so match loosely.
      await expect(page.locator('#rmjs-2')).toHaveCSS('transition', /^height .*\.56s/);
    });

    test('the new toggle says expanded right after the click, before the transition ends', async ({ page }) => {
      const toggle = page.locator('[aria-controls="rmjs-1"]');

      await expect(toggle).toHaveAttribute('aria-expanded', 'false');

      const result = await page.evaluate(() => {
        document.querySelector('[aria-controls="rmjs-1"]').click();

        return {
          ariaExpanded: document.querySelector('[aria-controls="rmjs-1"]').getAttribute('aria-expanded'),
          expanded: document.querySelector('#rmjs-1').readmore.expanded,
        };
      });

      expect(result).toEqual({ ariaExpanded: 'true', expanded: true });
    });

    test('leaves elements shorter than 384px untouched', async ({ page }) => {
      await expect(page.locator('article:nth-of-type(3) + [data-readmore-toggle]')).toHaveCount(0);
    });
  });
});
