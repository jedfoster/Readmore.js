/* globals cy, beforeEach */
/*

Feature: Basic Readmore.js usage
  As a developer, I need to be able to configure Readmore.js to suit my application.

  Scenario: Basic instantiation
    Given a page with content
    When Readmore.js is instantiated on 'article' elements, with no custom configuration
    Then all article elements taller than 200px are collapsed
    And all article elements shorter than 200px remain untouched

  Scenario: Basic operation with default configuration
    Given a Readmore.js instance with no custom configuration
    When the user clicks the first "Read more" link
    Then the first content block is expanded

  Scenario: Default configuration respects max-height CSS
    Given a page with content
    And the page CSS specifies a max-height of 300px for 'article' elements
    When Readmore.js is instantiated on 'article' elements
    Then all article elements taller than 300px are collapsed
    And all article elements shorter than 300px remain untouched

  Scenario: Basic custom configuration
    Given a Readmore.js instance with custom configuration for 'speed' and 'collapsedHeight'
    When Readmore.js is instantiated on 'article' elements
    Then all article elements taller than 'collapsedHeight' are collapsed
    And all article elements shorter than 'collapsedHeight' remain untouched
    And `article[data-readmore]` elements should have a 'transition: height ${speed}ms' CSS property

*/

// const visit = async function(

describe('Basic Readmore.js usage', () => {
  describe('Basic instantiation', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.visit('/');
      cy.wait(100);

      cy.get('[data-readmore-toggle="rmjs-1"]').click();

      cy.wait(130); // wait for transition
    });

    // This doesn't test what it's supposedly testing
    it('collapses all elements taller than 200px', () => {
      cy.get('#rmjs-1').should('have.attr', 'aria-expanded', 'true');
    });

    it('leaves elements shorter than 200px untouched', () => {
      cy.get('article:nth-of-type(3)').should('not.have.attr', 'aria-expanded');
    });
  });

  describe('Default configuration respects max-height CSS', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.visit('/?suite=max-height');
      cy.wait(100);

      cy.get('[data-readmore-toggle="rmjs-1"]').click();

      cy.wait(130); // wait for transition
    });

    it('collapses all elements taller than 300px', () => {
      cy.get('#rmjs-1').should('have.attr', 'aria-expanded', 'true');
    });

    it('leaves elements shorter than 300px untouched', () => {
      cy.get('article:nth-of-type(3)').should('not.have.attr', 'aria-expanded');
    });
  });
});
