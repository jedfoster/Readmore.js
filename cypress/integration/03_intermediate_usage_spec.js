/* globals cy, beforeEach */
/*

Feature: Intermediate Readmore.js usage
  As a developer, sometimes I need a bit more control over the behavior of Readmore.js.

  ✔︎ Scenario: 'embedCSS: false' option
    Given a Readmore.js instance configured with 'embedCSS: false'
    When Readmore.js is instantiated
    Then Readmore.js did not insert its CSS

  Scenario: 'blockCSS' option
    Given a Readmore.js instance configured with 'blockCSS' that sets the background of blocks to red
    When Readmore.js is instantiated on 'article' elements
    Then 'article' elements have a red background

  Scenario: 'startOpen' option
    Given a Readmore.js instance configured with 'startOpen: true'
    When Readmore.js is instantiated on 'article' elements
    Then all 'article' elements are expanded
    And the first toggle link is a 'lessLink'

  Scenario: 'sourceOrder' option
    Given a Readmore.js instance configured with 'sourceOrder: 'before''
    When Readmore.js is instantiated on 'article' elements
    Then the next sibling of the first "Read more" link is the first article

*/

describe('Intermediate Readmore.js usage', () => {
  describe('`embedCSS: false` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=embedCSS');
      cy.wait(75);
    });

    it('does not insert CSS block', () => {
      cy.get('head style:nth-of-type(2)').invoke('prop', 'innerText').should('not.include', 'article + [data-readmore-toggle]');
    });
  });
});
