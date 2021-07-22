/* globals cy, beforeEach */

describe('Readmore.js', () => {
  beforeEach(() => {
    // cy.viewport(550, 350);
    cy.visit('/');
    cy.wait(100);
  });

  it('Visits the Kitchen Sink', () => {
    cy.get('[data-readmore-toggle="rmjs-1"]').click();

    cy.wait(250); // wait for transition
    cy.get('#rmjs-1').should('have.attr', 'aria-expanded', 'true');
  });
});
