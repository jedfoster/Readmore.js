/* globals cy, beforeEach */
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

describe('Customized moreLink and lessLink options', () => {
  describe('Custom moreLink', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      cy.visit('/?suite=customToggleLinks');
      cy.wait(75);
    });

    it('displays a custom `moreLink`', () => {
      cy.get('[data-readmore-toggle="rmjs-1"]').should('contain', 'Gimme more');
      cy.get('[data-readmore-toggle="rmjs-1"]').invoke('prop', 'nodeName').should('eq', 'BUTTON');
    });

    it('displays a custom `lessLink`', () => {
      cy.get('[data-readmore-toggle="rmjs-1"]').click();
      cy.get('[data-readmore-toggle="rmjs-1"]').invoke('prop', 'nodeName').should('eq', 'SPAN');
      cy.get('[data-readmore-toggle="rmjs-1"]').should('contain', 'Gimme less');
    });
  });
});
