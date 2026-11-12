/*

Feature: Readmore.js API
  As a developer, sometimes my application may need to call methods on my Readmore.js instance.

  Scenario: Programmatically toggling a content block
    Given a Readmore.js instance
    And all blocks in the instance are collapsed
    When the 'toggle' method is invoked with a selector
    And the selector matches a member of the instance
    Then the element(s) matching the selector are expanded

  Scenario: Invoking 'toggle' on an element that does not belong to the instance
    Given a Readmore.js instance
    When the 'toggle' method is invoked with a selector
    And the selector does not match a member of the instance
    Then nothing happens

  Scenario: Programmatically toggling an instance
    Given a Readmore.js instance
    And all blocks in the instance are collapsed
    When the 'toggle' method is invoked without a selector
    Then all the blocks in the instance are expanded

  Scenario: Removing Readmore.js from a content block
    Given a Readmore.js instance
    When the 'destory' method is invoked with a selector
    And the selector matches a member of the instance
    Then Readmore.js functionality is removed from the element(s) matching the selector

  Scenario: Removing Readmore.js from an instance
    Given a Readmore.js instance
    When the 'destroy' method is invoked without a selector
    Then Readmore.js functionality is removed from all blocks in the instance

*/
import { expect, test, visit } from './fixtures.js';
import { iphone6, macbook15 } from './viewports.js';

test('exposes the package version', async ({ page }) => {
  await visit(page);
  expect(await page.evaluate(() => window.Readmore.VERSION)).toBe('3.0.0-beta-1');
});

const readmoreStyles = (page) =>
  page.evaluate(
    () =>
      Array.from(document.querySelectorAll('head style')).filter((tag) => tag.textContent.includes('article[data-readmore]'))
        .length,
  );

const autoHeightDiff = (article) =>
  article.evaluate((el) => {
    const computed = parseFloat(window.getComputedStyle(el).height);

    el.style.height = 'auto';

    return computed - parseFloat(window.getComputedStyle(el).height);
  });

test.describe('destroy()', () => {
  test.use({ viewport: macbook15 });

  test('removes the style, inline styles, toggles and listeners from every block', async ({ page }) => {
    await visit(page, 'basic');

    const styleCount = () => page.evaluate(() => document.querySelectorAll('head style').length);
    const before = await styleCount();

    expect(await readmoreStyles(page)).toBe(1);

    await page.evaluate(() => {
      window.folded = Array.from(document.querySelectorAll('[data-readmore]'));
      window.demo.destroy();
    });

    expect(await styleCount()).toBe(before - 1);
    expect(await readmoreStyles(page)).toBe(0);
    await expect(page.locator('[data-readmore]')).toHaveCount(0);
    await expect(page.locator('[data-readmore-toggle]')).toHaveCount(0);

    const inline = await page.evaluate(() =>
      window.folded.map((article) => ({
        overflow: article.style.overflow,
        transition: article.style.transition,
        height: article.style.height,
        maxHeight: article.style.maxHeight,
        hasState: 'readmore' in article,
      })),
    );

    expect(inline.length).toBeGreaterThan(0);
    inline.forEach((styles) => {
      expect(styles).toEqual({ overflow: '', transition: '', height: '', maxHeight: 'initial', hasState: false });
    });
  });

  test('releases a CSS max-height clamp', async ({ page }) => {
    await visit(page, 'max-height');

    const article = page.locator('article').first();

    expect(await article.evaluate((el) => el.getBoundingClientRect().height)).toBeLessThan(301);
    await page.evaluate(() => window.demo.destroy());

    expect(await article.evaluate((el) => [el.style.overflow, el.style.transition])).toEqual(['', '']);

    const full = await article.evaluate((el) => el.scrollHeight);

    expect(full).toBeGreaterThan(300);
    expect(Math.abs((await article.evaluate((el) => el.getBoundingClientRect().height)) - full)).toBeLessThan(1);
  });

  test('leaves the block at auto height after a viewport change', async ({ page }) => {
    await visit(page, 'basic');
    await page.evaluate(() => window.demo.destroy());
    await page.setViewportSize(iphone6);

    const article = page.locator('article').first();

    await page.waitForTimeout(400);

    expect(await article.evaluate((el) => el.style.height)).toBe('');
    expect(await autoHeightDiff(article)).toBe(0);
  });

  test('can be followed by a new instance that folds and resizes again', async ({ page }) => {
    await visit(page, 'basic');
    await page.evaluate(() => {
      window.demo.destroy();
      window.again = new window.Readmore('article', { collapsedHeight: 200 });
    });
    await expect(page.locator('[data-readmore]').first()).toHaveCSS('height', '200px');
    await page.setViewportSize(iphone6);
    await expect
      .poll(() =>
        page
          .locator('[data-readmore]')
          .first()
          .evaluate((el) => el.style.height),
      )
      .toBe('200px');
  });

  test('mid-animation: no error, no afterToggle, block ends at auto height', async ({ page }) => {
    await visit(page, 'basic');
    await page.evaluate(() => {
      window.afterToggleCalls = 0;
      window.demo.options.afterToggle = () => {
        window.afterToggleCalls += 1;
      };
    });

    const article = page.locator('article').first();

    await page.locator('[data-readmore-toggle]').first().click();
    await page.evaluate(() => window.demo.destroy());
    await page.waitForTimeout(800);

    expect(await page.evaluate(() => window.afterToggleCalls)).toBe(0);
    expect(await article.evaluate((el) => el.style.height)).toBe('');

    expect(await autoHeightDiff(article)).toBe(0);
  });
});
