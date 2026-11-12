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

  ✔︎ Scenario: Expanding a block created under a CSS 'max-height'
    Given the page CSS specifies a max-height of 300px for 'article' elements
    When Readmore.js is instantiated on a new long 'article' after the page loads
    And the user clicks its "Read more" link
    Then the block expands to its full content height, not 300px

  ✔︎ Scenario: Expanding a block created after the page loads
    Given an 'article' whose first and last children have margins
    When Readmore.js is instantiated on it after the page loads
    And the user clicks its "Read more" link
    Then the block expands to show all of its content, margins included

  ✔︎ Scenario: 'collapsedHeight' option as a function
    Given a Readmore.js instance configured with a 'collapsedHeight' function
    When Readmore.js is instantiated on 'article' elements
    Then the first article is as tall as the function's return value
    And when the viewport is resized, the article's height follows the function's new return value

  ✔︎ Scenario: CSS 'max-height' is re-read on resize
    Given the page CSS sets a max-height of 300px, and 150px below 600px wide
    When Readmore.js is instantiated on 'article' elements
    Then the first article is 300px tall on a wide viewport
    And 150px tall after the viewport narrows

  ✔︎ Scenario: Reduced motion turns the animation off
    Given the visitor prefers reduced motion and a Readmore.js instance has a 'speed' of 560
    When the user clicks the first "Read more" link
    Then the block expands with no transition
    And 'afterToggle' has fired by the time the click resolves
    And with reduced motion off, toggling again transitions the height

  ✔︎ Scenario: Inline 'max-height' on the block
    Given an 'article' with an inline max-height of 120px
    When Readmore.js is instantiated on it
    Then the block collapses to 120px

  ✔︎ Scenario: Container width changes without a viewport resize
    Given a Readmore.js instance with a 'collapsedHeight' function, inside a container whose width a button toggles
    When the user clicks the width button
    Then the first article's height follows the function's new return value
    And toggling a block open does not re-measure it partway through the animation

  ✔︎ Scenario: A width change interrupts the open animation
    Given a Readmore.js instance with an 'afterToggle' callback, inside a container whose width a button toggles
    When the user opens a block and the container width changes before the animation ends
    Then 'afterToggle' fires once, with the block expanded
    And the block ends at its new expanded height

  ✔︎ Scenario: A block hidden at setup
    Given an 'article' inside a hidden container
    When Readmore.js is instantiated on it
    Then it has no toggle, and toggling it does nothing
    And when the container is shown, the block folds and gets a "Read more" link

  ✔︎ Scenario: A block that stops needing the fold
    Given an 'article' that only needs folding below a certain width
    When its container narrows past that width
    Then the block folds and gets a "Read more" link
    And when the container widens again, the block unfolds and loses its link

  ✔︎ Scenario: Folding takes away the page's scrollbar
    Given an 'article' that folds at one width and fits at a slightly wider one
    And a container that widens while the block is folded, as when a page scrollbar goes away
    When the container narrows enough to fold the block
    Then the block folds, unfolds once, and stays unfolded

  ✔︎ Scenario: A 'collapsedHeight' function that returns Infinity
    Given an 'article' whose 'collapsedHeight' function returns Infinity above 600px wide, and 100 below
    When its container narrows below 600px
    Then the block folds to 100px and gets a "Read more" link
    And when the container widens again, the block unfolds and loses its link

  ✔︎ Scenario: A block inside a shadow root
    Given an 'article' inside an open shadow root
    When Readmore.js is instantiated on it
    And the user clicks its "Read more" link
    Then the toggle becomes a "Close" link, with 'aria-expanded' set to 'true'

*/
import { expect, test, visit } from './fixtures.js';
import { iphone6, macbook15 } from './viewports.js';

test.describe('Intermediate Readmore.js usage', () => {
  test.use({ viewport: macbook15 });

  test.describe('`embedCSS: false` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'embedCSS');
    });

    test('adds no <style> to the head', async ({ page }) => {
      const counts = await page.evaluate(() => {
        const before = document.querySelectorAll('head style').length;
        const el = document.querySelector('article').cloneNode(true);

        el.removeAttribute('id');
        document.body.append(el);
        new window.Readmore(el, { embedCSS: false });

        return { before, after: document.querySelectorAll('head style').length };
      });

      expect(counts.after).toBe(counts.before);
    });

    test('still hides overflow and transitions the height inline', async ({ page }) => {
      const block = page.locator('article[data-readmore]').first();

      await expect(block).toHaveCSS('overflow', 'hidden');
      await expect(block).toHaveCSS('transition-property', 'height');
    });

    test('keeps each instance its own transition speed', async ({ page }) => {
      const durations = await page.evaluate(() => {
        const first = document.querySelector('article[data-readmore]');
        const clone = first.cloneNode(true);

        clone.removeAttribute('id');
        clone.removeAttribute('data-readmore');
        clone.removeAttribute('style');
        document.body.append(clone);
        new window.Readmore(clone, { embedCSS: false, speed: 900 });

        return [getComputedStyle(first).transitionDuration, getComputedStyle(clone).transitionDuration];
      });

      expect(durations[0]).not.toBe(durations[1]);
      expect(durations[1]).toBe('0.9s');
    });
  });

  test.describe('`blockCSS` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'blockCSS');
    });

    test('applies custom block styles to Readmore blocks', async ({ page }) => {
      // getComputedStyle returns colors in rgb, regardless of original form
      await expect(page.locator('#rmjs-2')).toHaveCSS('background-color', 'rgb(255, 0, 0)');
    });
  });

  test.describe('`startOpen` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'startOpen');
    });

    test('leaves all articles expanded', async ({ page }) => {
      await expect(page.locator('[aria-controls="rmjs-1"]')).toHaveAttribute('aria-expanded', 'true');
      await expect(page.locator('[data-readmore-toggle="rmjs-1"]')).toContainText('Close');
    });
  });

  test.describe('`sourceOrder: "before"` option', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'sourceOrder');
    });

    test('inserts the toggle before its corresponding block', async ({ page }) => {
      const siblings = page.locator('[data-readmore-toggle="rmjs-1"]').locator('xpath=..').locator('> *');

      await expect(siblings.nth(0)).toHaveAttribute('data-readmore-toggle', 'rmjs-1');
      await expect(siblings.nth(3)).toContainText('Portland Leggings');
    });
  });

  test.describe('block created under a CSS `max-height`', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'max-height');
    });

    test('expands to its full content height', async ({ page }) => {
      // The debounced re-measure that follows `load` would also measure the new block, hiding the bug.
      await page.waitForTimeout(300);

      // Keeps the block's width, and so its wrapping, from changing when the new block makes the page scroll.
      await page.addStyleTag({ content: 'html { overflow-y: scroll; }' });

      const { id, contentHeight } = await page.evaluate(() => {
        const article = document.createElement('article');

        article.innerHTML = document.querySelector('article').innerHTML;
        document.querySelector('#demo').appendChild(article);

        article.style.maxHeight = 'none';

        const contentHeight = article.getBoundingClientRect().height;

        article.style.maxHeight = '';
        new window.Readmore(article);

        return { id: article.id, contentHeight };
      });

      await page.locator(`[data-readmore-toggle="${id}"]`).click();

      const block = page.locator(`#${id}`);

      expect(contentHeight).toBeGreaterThan(300);
      await expect
        .poll(() => block.evaluate((node) => node.getBoundingClientRect().height))
        .toBeGreaterThanOrEqual(contentHeight - 1);
    });
  });

  test.describe('reduced motion', () => {
    test('skips the transition and fires `afterToggle` at once, then restores it', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await visit(page, 'reducedMotion');

      const block = page.locator('#rmjs-1');
      const calls = () => page.evaluate(() => window.afterToggleCalls.length);

      await expect(block).toHaveCSS('transition-duration', '0s');
      await page.locator('[data-readmore-toggle="rmjs-1"]').click();

      expect(await calls()).toBe(1);
      await expect(block).toHaveCSS('transition-duration', '0s');

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.locator('[data-readmore-toggle="rmjs-1"]').click();

      await expect(block).toHaveCSS('transition-duration', '0.56s');
      await expect.poll(calls).toBe(2);
    });
  });

  test.describe('`collapsedHeight` function', () => {
    const callbackHeight = (page) =>
      page
        .locator('#rmjs-1')
        .evaluate((el) => el.querySelector('p').getBoundingClientRect().bottom - el.getBoundingClientRect().top);

    const blockHeight = (page) => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height);

    test.beforeEach(async ({ page }) => {
      await visit(page, 'collapsedHeightCallback');
    });

    test('collapses to the return value', async ({ page }) => {
      const expected = await callbackHeight(page);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expected, 0);
    });

    test('follows the return value when the viewport resizes', async ({ page }) => {
      const wide = await blockHeight(page);

      await page.setViewportSize(iphone6);

      await expect.poll(() => blockHeight(page)).not.toBeCloseTo(wide, 0);

      const expected = await callbackHeight(page);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expected, 0);
    });
  });

  test.describe('CSS `max-height` with a media query', () => {
    test.beforeEach(async ({ page }) => {
      await visit(page, 'max-height-media');
    });

    test('is 300px on a wide viewport and 150px on a narrow one', async ({ page }) => {
      await expect.poll(() => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height)).toBe(300);

      await page.setViewportSize(iphone6);

      await expect.poll(() => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height)).toBe(150);
    });
  });

  test.describe('block created after the page loads', () => {
    test('expands to show all of its content, including its children’s margins', async ({ page }) => {
      await visit(page);
      // Past the debounced re-measure that follows `load`, which would otherwise measure the block again.
      await page.waitForTimeout(300);

      await page.evaluate(() => {
        const clone = document.querySelector('article').cloneNode(true);

        clone.removeAttribute('data-readmore');
        clone.removeAttribute('style');
        clone.id = 'late';
        document.getElementById('demo').appendChild(clone);
        new window.Readmore(clone, { speed: 0 });
      });

      await page.locator('[data-readmore-toggle="late"]').click();

      expect(await page.locator('#late').evaluate((el) => el.scrollHeight - el.clientHeight)).toBe(0);
    });
  });

  test.describe('inline max-height', () => {
    test('collapses a block to its own inline `max-height`', async ({ page }) => {
      await visit(page);

      await page.evaluate(() => {
        const clone = document.querySelector('article').cloneNode(true);

        clone.id = 'inline-max';
        clone.style.maxHeight = '120px';
        document.getElementById('demo').appendChild(clone);
        new window.Readmore(clone);
      });

      await expect(page.locator('#inline-max')).toHaveCSS('height', '120px');
    });
  });

  test.describe('folding on re-measure', () => {
    const toggle = (page) => page.locator('#refold-wrapper [data-readmore-toggle]');
    const block = (page) => page.locator('#refold');

    // `fitWidth` sets collapsedHeight to the block's height at that container width, so it only folds when narrower.
    // `unfoldAbove` makes collapsedHeight a function returning Infinity above that block width, and 100 below it.
    const addBlock = (page, { hidden = false, fitWidth, unfoldAbove, options: extra = {} } = {}) =>
      page.evaluate(
        ({ hidden, fitWidth, unfoldAbove, extra }) => {
          const wrapper = document.createElement('div');
          const clone = document.querySelector('article').cloneNode(true);
          const options = { speed: 0, ...extra };

          clone.removeAttribute('data-readmore');
          clone.removeAttribute('style');
          clone.id = 'refold';
          wrapper.id = 'refold-wrapper';
          wrapper.hidden = hidden;
          wrapper.appendChild(clone);
          document.getElementById('demo').appendChild(wrapper);

          if (fitWidth) {
            wrapper.style.width = `${fitWidth}px`;
            options.collapsedHeight = Math.ceil(clone.getBoundingClientRect().height);
          }

          if (unfoldAbove) {
            wrapper.style.width = `${unfoldAbove + 300}px`;
            options.collapsedHeight = (el) => (el.offsetWidth > unfoldAbove ? Infinity : 100);
          }

          window.refold = new window.Readmore(clone, options);
        },
        { hidden, fitWidth, unfoldAbove, extra },
      );

    const setWrapper = (page, props) =>
      page.evaluate((props) => {
        Object.assign(document.getElementById('refold-wrapper'), props.attrs);
        Object.assign(document.getElementById('refold-wrapper').style, props.style);
      }, props);

    test('folds a block that was hidden at setup once it is shown', async ({ page }) => {
      await visit(page);
      await addBlock(page, { hidden: true });

      await expect(toggle(page)).toHaveCount(0);

      await page.evaluate(() => window.refold.toggle(document.getElementById('refold')));

      expect(await block(page).evaluate((el) => el.readmore.expanded)).toBe(false);

      await setWrapper(page, { attrs: { hidden: false } });

      await expect(toggle(page)).toHaveText('Read More');
      await expect(block(page)).toHaveCSS('height', '200px');
      await expect(block(page)).toHaveAttribute('data-readmore', '');
    });

    test('folds a block once its container narrows, and unfolds it once it fits again', async ({ page }) => {
      await visit(page);
      await addBlock(page, { fitWidth: 900 });

      await expect(toggle(page)).toHaveCount(0);

      await setWrapper(page, { style: { width: '300px' } });

      await expect(toggle(page)).toHaveText('Read More');
      await expect(block(page)).toHaveAttribute('data-readmore', '');
      await expect(block(page)).toHaveCSS('overflow', 'hidden');

      await setWrapper(page, { style: { width: '900px' } });

      await expect(toggle(page)).toHaveCount(0);
      await expect(block(page)).not.toHaveAttribute('data-readmore');
      await expect(block(page)).toHaveCSS('overflow', 'visible');
      expect(await block(page).evaluate((el) => el.style.height)).toBe('auto');
    });

    test('settles unfolded when folding widens the block enough to unfold it', async ({ page }) => {
      await visit(page);
      await addBlock(page, { fitWidth: 600 });

      // Stands in for a page scrollbar that goes away while the block is folded, which widens it.
      await page.evaluate(() => {
        const el = document.getElementById('refold');
        const wrapper = document.getElementById('refold-wrapper');

        window.foldChanges = 0;
        new MutationObserver(() => {
          window.foldChanges += 1;
          wrapper.style.width = el.hasAttribute('data-readmore') ? '600px' : '500px';
        }).observe(el, { attributes: true, attributeFilter: ['data-readmore'] });
      });

      await setWrapper(page, { style: { width: '500px' } });
      await expect.poll(() => page.evaluate(() => window.foldChanges)).toBe(2);
      await page.waitForTimeout(500);

      expect(await page.evaluate(() => window.foldChanges)).toBe(2);
      await expect(block(page)).not.toHaveAttribute('data-readmore');
      await expect(toggle(page)).toHaveCount(0);
    });

    test('leaves a block unfolded while a `collapsedHeight` function returns Infinity', async ({ page }) => {
      await visit(page);
      await addBlock(page, { unfoldAbove: 600 });

      await expect(toggle(page)).toHaveCount(0);

      await setWrapper(page, { style: { width: '300px' } });
      await expect(toggle(page)).toHaveText('Read More');
      await expect(block(page)).toHaveCSS('height', '100px');

      await setWrapper(page, { style: { width: '900px' } });
      await expect(toggle(page)).toHaveCount(0);
      await expect(block(page)).not.toHaveAttribute('data-readmore');
    });

    test('folds an open block again without a toggle when there is no `lessLink`', async ({ page }) => {
      await visit(page);
      await addBlock(page, { fitWidth: 900, options: { lessLink: '' } });
      await setWrapper(page, { style: { width: '300px' } });
      await toggle(page).click();

      await expect(toggle(page)).toHaveCount(0);

      await setWrapper(page, { style: { width: '900px' } });
      await expect(block(page)).not.toHaveAttribute('data-readmore');

      await setWrapper(page, { style: { width: '320px' } });
      await expect(block(page)).toHaveAttribute('data-readmore', '');
      await expect(toggle(page)).toHaveCount(0);
      expect(await block(page).evaluate((el) => el.readmore.expanded)).toBe(true);
    });
  });

  test.describe('shadow root', () => {
    test('swaps the toggle of a block inside a shadow root', async ({ page }) => {
      await visit(page);

      await page.evaluate(() => {
        const host = document.createElement('div');
        const clone = document.querySelector('article').cloneNode(true);

        clone.removeAttribute('id');
        clone.removeAttribute('data-readmore');
        clone.removeAttribute('style');
        host.id = 'shadow-host';
        host.attachShadow({ mode: 'open' }).appendChild(clone);
        document.getElementById('demo').appendChild(host);
        new window.Readmore(clone, { speed: 0 });
      });

      const toggle = page.locator('#shadow-host [data-readmore-toggle]');

      await expect(toggle).toHaveText('Read More');
      await toggle.click();
      await expect(toggle).toHaveText('Close');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('container width change', () => {
    const callbackHeight = (page) =>
      page
        .locator('#rmjs-1')
        .evaluate((el) => el.querySelector('p').getBoundingClientRect().bottom - el.getBoundingClientRect().top);

    const blockHeight = (page) => page.locator('#rmjs-1').evaluate((el) => el.getBoundingClientRect().height);

    test.beforeEach(async ({ page }) => {
      await visit(page, 'containerResize');
    });

    test('follows the `collapsedHeight` function without a viewport resize', async ({ page }) => {
      const wide = await blockHeight(page);

      await page.locator('#width-button').click();

      await expect.poll(() => blockHeight(page)).not.toBeCloseTo(wide, 0);

      const expected = await callbackHeight(page);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expected, 0);
    });

    test('does not re-measure a block partway through its open animation', async ({ page }) => {
      // The debounced re-measure that follows `load` would otherwise land mid-animation and cancel it.
      await page.waitForTimeout(300);

      const result = await page.evaluate(
        () =>
          new Promise((resolve) => {
            const block = document.getElementById('rmjs-1');
            const heights = [];
            const sample = () => {
              heights.push(block.getBoundingClientRect().height);
              requestAnimationFrame(sample);
            };

            block.addEventListener('transitionend', () => resolve({ heights, expandedHeight: block.readmore.expandedHeight }), {
              once: true,
            });
            document.querySelector('[data-readmore-toggle="rmjs-1"]').click();
            sample();
          }),
      );

      expect(result.heights.length).toBeGreaterThan(2);

      for (let i = 1; i < result.heights.length; i += 1) {
        expect(result.heights[i]).toBeGreaterThanOrEqual(result.heights[i - 1]);
      }

      await expect.poll(() => blockHeight(page)).toBeCloseTo(result.expandedHeight, 0);
    });

    test('fires `afterToggle` once when a width change interrupts the open animation', async ({ page }) => {
      await page.waitForTimeout(300);

      await page.evaluate(() => {
        document.querySelector('[data-readmore-toggle="rmjs-1"]').click();
        document.getElementById('width-button').click();
      });

      await expect.poll(() => page.evaluate(() => window.afterToggleCalls.length)).toBe(1);
      await page.waitForTimeout(800);

      expect(await page.evaluate(() => window.afterToggleCalls)).toEqual([{ id: 'rmjs-1', expanded: true }]);

      const expandedHeight = await page.locator('#rmjs-1').evaluate((el) => el.readmore.expandedHeight);

      await expect.poll(() => blockHeight(page)).toBeCloseTo(expandedHeight, 0);
    });
  });
});
