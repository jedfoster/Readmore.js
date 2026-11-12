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

test('exposes the package version', async ({ page }) => {
  await visit(page);
  expect(await page.evaluate(() => window.Readmore.VERSION)).toBe('3.0.0-beta-1');
});
