/* globals cy, beforeEach */
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

describe('Advanced Readmore.js usage - Callbacks', () => {
  describe('`embedCSS: false` option', () => {
    beforeEach(() => {
      // cy.viewport(550, 350)
      cy.viewport('macbook-15');
      // cy.wait(75);
    });

    it('calls blockProcessed callback', () => {
      const mockFunc = cy.spy().as('blockProcessed');
      cy.on('window:before:load', (win) => Object.defineProperty(win, 'mockFunc', { get: () => mockFunc }));
      cy.visit('/?suite=blockProcessed');

      cy.get('@blockProcessed').should('be.called');
      cy.get('@blockProcessed').should(($foo) => {
        cy.log($foo);
        console.log($foo);

        return true;
      });

      // expect(1).to.equal(2);
      // cy.get('@blockProcessed').should('be.calledWithMatch', cy.should('match.instanceOf', Node));

      cy.log(cy.get('@blockProcessed'));

      // cy.visit('/?suite=blockProcessed').then((win) => {
      //   // need an object and a method name
      //   const spy = cy.spy(win.demo.options, 'blockProcessed').as('track');
      //   cy.get('@track').should('be.called')
      //   // expect(spy).to.be.called;
      // })
    });
  });

  // describe('`blockCSS` option', () => {
  //   beforeEach(() => {
  //     // cy.viewport(550, 350)
  //     cy.viewport('macbook-15');
  //     cy.visit('/?suite=blockCSS');
  //     cy.wait(75);
  //   });

  //   it('applies custom block styles to Readmore blocks', () => {
  //     cy.get('#rmjs-2')
  //       .should('have.css', 'background-color')
  //       // getComputedStyle returns colors in rgb, regardless of original form
  //       .and('eq', 'rgb(255, 0, 0)');
  //   });
  // });

  // describe('`startOpen` option', () => {
  //   beforeEach(() => {
  //     // cy.viewport(550, 350)
  //     cy.viewport('macbook-15');
  //     cy.visit('/?suite=startOpen');
  //     cy.wait(75);
  //   });

  //   it('leaves all articles expanded', () => {
  //     cy.get('article:nth-of-type(2)').should('have.attr', 'aria-expanded');
  //     cy.get('[data-readmore-toggle="rmjs-1"]').should('contain', 'Close');
  //   });
  // });

  // describe('`sourceOrder: "before"` option', () => {
  //   beforeEach(() => {
  //     // cy.viewport(550, 350)
  //     cy.viewport('macbook-15');
  //     cy.visit('/?suite=sourceOrder');
  //     cy.wait(75);
  //   });

  //   it(`inserts the toggle before it's corresponding block`, () => {
  //     cy.get('[data-readmore-toggle="rmjs-1"]')
  //       .parent()
  //       .children('*:nth-child(1)')
  //       .should('have.attr', 'data-readmore-toggle', 'rmjs-1');
  //     cy.get('[data-readmore-toggle="rmjs-1"]')
  //       .parent()
  //       .children('*:nth-child(4)')
  //       .should('contain', 'Portland Leggings');
  //   });
  // });
});
