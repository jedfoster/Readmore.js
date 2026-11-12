
Options:
  * `speed: 100` in milliseconds
  * `collapsedHeight: 200` in pixels
  * `heightMargin: 16` in pixels, avoids collapsing blocks that are only slightly larger than `collapsedHeight`
  * `moreLink: '<a href="#">Read more</a>'` HTML string for the "more" toggle link; also accepts a callback function that returns an HTML string
  * `lessLink: '<a href="#">Close</a>'` HTML string for the "less" toggle link; also accepts a callback function that returns an HTML string
  * `embedCSS: true` insert required CSS dynamically, set this to `false` if you include the necessary CSS in a stylesheet
  * `blockCSS: 'display: block; width: 100%;'` sets the styling of the blocks, ignored if `embedCSS` is `false`
  * `startOpen: false` do not immediately truncate, start in the fully opened position
  * `sourceOrder: 'after'` the toggle link is inserted `'before'` or `'after'` the block

Callbacks:
  * `moreLink: '<a href="#">Read more</a>'` HTML string for the "more" toggle link; also accepts a callback function that returns an HTML string
  * `lessLink: '<a href="#">Close</a>'` HTML string for the "less" toggle link; also accepts a callback function that returns an HTML string
  * `blockProcessed: function() {}` called once per block during initilization after Readmore.js has processed the block
  * `beforeToggle: function() {}` called after a more or less link is clicked, but *before* the block is collapsed or expanded
  * `afterToggle: function() {}` called *after* the block is collapsed or expanded

  If the element has a `max-height` CSS property, Readmore.js will use that value rather than the value of the `collapsedHeight` option.



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


Feature: Alternative types for Readmore class constructor
  As a developer, sometimes I need to pass different types when instantiating Readmore.js

  Scenario: Element object
    Given a page with content
    When Readmore.js is instantiated with an Element object
    Then only that Element is collapsed

  Scenario: NodeList object
    Given a page with content
    When Readmore.js is instantiated with a NodeList collection
    Then all Elements in the NodeList are processed






  The `Readmore` class constructor and all methods accept as arguments, either:

* `selector String` valid CSS selectors; e.g. `'blockquote'`, `'.truncate-block'`, or `'#blog .section'`
* `Element` a single Element object; e.g. return value of `document.getElementById('blog')`
* `NodeList` a NodeList collection of Elements; e.g. return value of `document.querySelectorAll('article')`




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




Feature: Intermediate Readmore.js usage
  As a developer, sometimes I need even more control over the behavior of Readmore.js.

  Scenario: 'embedCSS: false' option
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



  Scenario: Provided email address is associated with multiple accounts
    Given a user
    And the user entered an email address associated with multiple accounts
    When the user submits a request to retrieve their username
    Then the user is presented with a multiple accounts error message

  Scenario: Provided email address is not registered
    Given a user
    And the user entered a non registered email address
    When the user submits a request to retrieve their username
    Then the user is presented with a no matches error message

  Scenario: User omits email address in retrieve username form
    Given a user
    And the user omits the email address field
    When the user submits a request to retrieve their username
    Then the user is presented with a missing field error message

  Scenario: User enters an invalid email in retrieve username form
    Given a user
    And the user entered an invalid email address
    When the user submits a request to retrieve their username
    Then the user is presented with an invalid email error message

