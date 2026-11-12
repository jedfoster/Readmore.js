/*

Feature: Customized moreLink and lessLink options
  As a developer, I need to be able to customize the content of the "more" and "less" links

  ✔︎ Scenario: Custom moreLink
    Given a Readmore.js instance with a custom HTML string for 'moreLink'
    When Readmore.js is instantiated on 'article' elements
    Then the first "more" link should match 'moreLink'

  ✔︎ Scenario: Custom lessLink
    Given a Readmore.js instance with a custom HTML string for 'lessLink'
    And Readmore.js is instantiated on 'article' elements
    When the user clicks the first "more" link
    Then the first "less" link should match 'lessLink'

*/
import { expect, test, visit } from './fixtures.js';
import { macbook15 } from './viewports.js';

test.describe('Customized moreLink and lessLink options', () => {
  test.use({ viewport: macbook15 });

  test.describe('Custom moreLink', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'customToggleLinks');
    });

    test('displays a custom `moreLink`', async ({ page }) => {
      const toggle = page.locator('[data-readmore-toggle="rmjs-1"]');

      await expect(toggle).toContainText('Gimme more');
      expect(await toggle.evaluate((node) => node.nodeName)).toBe('BUTTON');
    });

    test('displays a custom `lessLink`', async ({ page }) => {
      const toggle = page.locator('[data-readmore-toggle="rmjs-1"]');

      await toggle.click();

      await expect(toggle).toContainText('Gimme less');
      expect(await toggle.evaluate((node) => node.nodeName)).toBe('SPAN');
    });
  });
});
