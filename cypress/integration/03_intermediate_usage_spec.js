/* globals cy, beforeEach */
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

describe('Intermediate Readmore.js usage', () => {
  describe('`embedCSS: false` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=embedCSS');
      cy.window().should('have.property', 'Readmore');
    });

    it('does not insert CSS block', () => {
      cy.get('head style:nth-of-type(2)')
        .invoke('prop', 'innerText')
        .should('not.include', 'article + [data-readmore-toggle]');
    });
  });

  describe('`blockCSS` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=blockCSS');
      cy.window().should('have.property', 'Readmore');
    });

    it('applies custom block styles to Readmore blocks', () => {
      cy.get('#rmjs-2')
        .should('have.css', 'background-color')
        // getComputedStyle returns colors in rgb, regardless of original form
        .and('eq', 'rgb(255, 0, 0)');
    });
  });

  describe('`startOpen` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=startOpen');
      cy.window().should('have.property', 'Readmore');
    });

    it('leaves all articles expanded', () => {
      cy.get('article:nth-of-type(2)').should('have.attr', 'aria-expanded');
      cy.get('[data-readmore-toggle="rmjs-1"]').should('contain', 'Close');
    });
  });

  describe('`sourceOrder: "before"` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=sourceOrder');
      cy.window().should('have.property', 'Readmore');
    });

    it(`inserts the toggle before it's corresponding block`, () => {
      cy.get('[data-readmore-toggle="rmjs-1"]')
        .parent()
        .children('*:nth-child(1)')
        .should('have.attr', 'data-readmore-toggle', 'rmjs-1');
      cy.get('[data-readmore-toggle="rmjs-1"]')
        .parent()
        .children('*:nth-child(4)')
        .should('contain', 'Portland Leggings');
    });
  });
});
