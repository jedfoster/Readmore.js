/*

Feature: Advanced Readmore.js usage
  As a developer, sometimes I need to run application logic at various points in the lifecycle of my Readmore.js instance.

  Scenario: 'blockProcessed' callback
    Given a Readmore.js instance configured with a 'blockProcessed' callback
    When Readmore.js is instantiated on 'article' elements
    Then 'blockProcessed' is invoked for each 'article' element

  Scenario: 'blockProcessed' callback recieves an 'element' and 'collapsible'
    Given a Readmore.js instance configured with a 'blockProcessed' callback
    And Readmore.js is instantiated on 'article' elements
    When an 'article' is shorter than 200px
    Then 'blockProcessed' is invoked
    And the 'collapsible' argument of 'blockProcessed' is 'false'

  Scenario: 'beforeToggle' callback
    Given a Readmore.js instance configured with a 'beforeToggle' callback
    And Readmore.js is instantiated on 'article' elements
    When the user clicks the first "Read more" link
    Then 'beforeToggle' is invoked
    And receives the "Read more" link
    And receives the 'article' element
    And receives 'true' for 'expanded' argument

  Scenario: 'afterToggle' callback
    Given a Readmore.js instance configured with a 'afterToggle' callback
    And Readmore.js is instantiated on 'article' elements
    And the first 'article' element is expanded
    When the user clicks the first "Close" link
    Then 'afterToggle' is invoked
    And receives the "Close" link
    And receives the 'article' element
    And receives 'false' for 'expanded' argument

  Scenario: 'afterToggle' callback with a 'speed' of 0
    Given a Readmore.js instance configured with a 'speed' of 0 and a 'afterToggle' callback
    When the user clicks the first "Read more" link
    Then the 'article' element expands
    And 'afterToggle' is invoked
    And no page error is raised

  Scenario: 'beforeToggle' callback returns 'false'
    Given a Readmore.js instance configured with a 'beforeToggle' callback
    And Readmore.js is instantiated on 'article' elements
    And the user clicks the first "Read more" link
    And 'beforeToggle' is invoked
    When 'beforeToggle' returns 'false'
    Then the expansion is canceled
    And the first 'article' remains collapsed

  Scenario: 'moreLink' callback
    Given a Readmore.js instance configured with a callback function as the 'moreLink' option
    And Readmore.js is instantiated on 'article' elements
    Then the first toggle link is the result of of the 'moreLink' callback

  Scenario: 'lessLink' callback
    Given a Readmore.js instance configured with a callback function as the 'lessLink' option
    And Readmore.js is instantiated on 'article' elements
    And the first 'article' element is expanded
    Then the first toggle link is the result of of the 'lessLink' callback

*/
import { expect, test, visit } from './fixtures.js';
import { macbook15 } from './viewports.js';

test.describe('Advanced Readmore.js usage - Callbacks', () => {
  test.use({ viewport: macbook15 });

  test.describe('`blockProcessed` callback', () => {
    test('calls blockProcessed for each article, with the element and whether it is collapsible', async ({ page }) => {
      await visit(page, 'blockProcessed');

      const calls = await page.evaluate(() => window.blockProcessedCalls);

      expect(calls).toEqual([
        { tagName: 'ARTICLE', heading: 'Artisanal Narwahls', collapsible: true },
        { tagName: 'ARTICLE', heading: 'Portland Leggings', collapsible: true },
        { tagName: 'ARTICLE', heading: 'This section is shorter than the Readmore minimum', collapsible: false },
      ]);
    });
  });

  test.describe('`afterToggle` callback with `speed: 0`', () => {
    test('fires on expand without raising a page error', async ({ page }) => {
      await visit(page, 'speedZero');
      await page.locator('[data-readmore-toggle="rmjs-1"]').click();

      expect(await page.evaluate(() => window.afterToggleCalls)).toEqual([{ id: 'rmjs-1', expanded: true }]);
      await expect(page.locator('[data-readmore-toggle="rmjs-1"]')).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
