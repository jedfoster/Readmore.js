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

  ✔︎ Scenario: Expanding a block created under a CSS 'max-height'
    Given the page CSS specifies a max-height of 300px for 'article' elements
    When Readmore.js is instantiated on a new long 'article' after the page loads
    And the user clicks its "Read more" link
    Then the block expands to its full content height, not 300px

  ✔︎ Scenario: 'collapsedHeight' option as a function
    Given a Readmore.js instance configured with a 'collapsedHeight' function
    When Readmore.js is instantiated on 'article' elements
    Then the first article is as tall as the function's return value
    And when the viewport is resized, the article's height follows the function's new return value

  ✔︎ Scenario: CSS 'max-height' is re-read on resize
    Given the page CSS sets a max-height of 300px, and 150px below 600px wide
    When Readmore.js is instantiated on 'article' elements
    Then the first article is 300px tall on a wide viewport
    And 150px tall after the viewport narrows

*/
import { expect, test, visit } from './fixtures.js';
import { iphone6, macbook15 } from './viewports.js';

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

  test.describe('block created under a CSS `max-height`', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'max-height');
    });

    test('expands to its full content height', async ({ page }) => {
      // The debounced re-measure that follows `load` would also measure the new block, hiding the bug.
      await page.waitForTimeout(300);

      // Keeps the block's width, and so its wrapping, from changing when the new block makes the page scroll.
      await page.addStyleTag({ content: 'html { overflow-y: scroll; }' });

      const { id, contentHeight } = await page.evaluate(() => {
        const article = document.createElement('article');

        article.innerHTML = document.querySelector('article').innerHTML;
        document.querySelector('#demo').appendChild(article);

        article.style.maxHeight = 'none';

        const contentHeight = article.getBoundingClientRect().height;

        article.style.maxHeight = '';
        new window.Readmore(article);

        return { id: article.id, contentHeight };
      });

      await page.locator(`[data-readmore-toggle="${id}"]`).click();

      const block = page.locator(`#${id}`);

      expect(contentHeight).toBeGreaterThan(300);
      await expect
        .poll(() => block.evaluate((node) => node.getBoundingClientRect().height))
        .toBeGreaterThanOrEqual(contentHeight - 1);
    });
  });

  test.describe('`collapsedHeight` function', () => {
    const callbackHeight = (page) =>
      page
        .locator('#rmjs-1')
        .evaluate((el) => el.querySelector('p').getBoundingClientRect().bottom - el.getBoundingClientRect().top);

    const blockHeight = (page) => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height);

    test.beforeEach(async ({ page }) => {
      await visit(page, 'collapsedHeightCallback');
    });

    test('collapses to the return value', async ({ page }) => {
      const expected = await callbackHeight(page);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expected, 0);
    });

    test('follows the return value when the viewport resizes', async ({ page }) => {
      const wide = await blockHeight(page);

      await page.setViewportSize(iphone6);

      await expect.poll(() => blockHeight(page)).not.toBeCloseTo(wide, 0);

      const expected = await callbackHeight(page);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expected, 0);
    });
  });

  test.describe('CSS `max-height` with a media query', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'max-height-media');
    });

    test('is 300px on a wide viewport and 150px on a narrow one', async ({ page }) => {
      await expect.poll(() => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height)).toBe(300);

      await page.setViewportSize(iphone6);

      await expect.poll(() => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height)).toBe(150);
    });
  });
});
