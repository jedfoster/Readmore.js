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
