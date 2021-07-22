/*

Feature: Customized moreLink and lessLink options
  As a developer, I need to be able to customize the content of the "more" and "less" links

  Scenario: Custom moreLink
    Given a Readmore.js instance with a custom HTML string for 'moreLink'
    When Readmore.js is instantiated on 'article' elements
    Then the first "more" link should match 'moreLink'

  Scenario: Custom lessLink
    Given a Readmore.js instance with a custom HTML string for 'lessLink'
    And Readmore.js is instantiated on 'article' elements
    When the user clicks the first "more" link
    Then the first "less" link should match 'lessLink'

*/
