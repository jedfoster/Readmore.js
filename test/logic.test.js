import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';

import { debounce, resolveCollapsedHeight, shouldFold, targetHeight, transitionFor, uniqueId, widthOf } from '../src/logic.js';

test('shouldFold folds a block taller than the collapsed height plus margin', () => {
  assert.equal(shouldFold(400, 200, 16), true);
});

test('shouldFold leaves a block exactly at the collapsed height plus margin alone', () => {
  assert.equal(shouldFold(216, 200, 16), false);
});

test('shouldFold leaves a block shorter than the collapsed height alone', () => {
  assert.equal(shouldFold(100, 200, 16), false);
});

test('resolveCollapsedHeight calls a function option with the element', () => {
  const element = {};

  assert.equal(resolveCollapsedHeight({ option: (el) => (el === element ? 120 : 0), element, cssMaxHeight: 300 }), 120);
});

test('resolveCollapsedHeight coerces a numeric string from a function option', () => {
  assert.equal(resolveCollapsedHeight({ option: () => '150', element: {}, cssMaxHeight: 300 }), 150);
});

test('resolveCollapsedHeight keeps Infinity from a function option, so the block never folds', () => {
  const collapsedHeight = resolveCollapsedHeight({ option: () => Infinity, element: {}, cssMaxHeight: 300 });

  assert.equal(collapsedHeight, Infinity);
  assert.equal(shouldFold(5000, collapsedHeight, 16), false);
});

test('resolveCollapsedHeight falls through to the CSS max-height when a function returns NaN', () => {
  assert.equal(resolveCollapsedHeight({ option: () => NaN, element: {}, cssMaxHeight: 300 }), 300);
});

test('resolveCollapsedHeight falls through to the CSS max-height when a function returns undefined', () => {
  assert.equal(resolveCollapsedHeight({ option: () => undefined, element: {}, cssMaxHeight: 300 }), 300);
});

test('resolveCollapsedHeight prefers the CSS max-height over a numeric option', () => {
  assert.equal(resolveCollapsedHeight({ option: 200, element: {}, cssMaxHeight: 300 }), 300);
});

test('resolveCollapsedHeight falls back to the option when the CSS max-height is NaN', () => {
  assert.equal(resolveCollapsedHeight({ option: '200', element: {}, cssMaxHeight: NaN }), 200);
});

test('targetHeight returns the expanded height when expanded', () => {
  assert.equal(targetHeight({ expanded: true, expandedHeight: 400, collapsedHeight: 200 }), 400);
});

test('targetHeight returns the collapsed height when collapsed', () => {
  assert.equal(targetHeight({ expanded: false, expandedHeight: 400, collapsedHeight: 200 }), 200);
});

test('uniqueId is prefixed with rmjs-', () => {
  assert.match(uniqueId(), /^rmjs-\d+$/);
});

test('uniqueId increments on every call', () => {
  const first = Number(uniqueId().slice('rmjs-'.length));
  const second = Number(uniqueId().slice('rmjs-'.length));

  assert.equal(second, first + 1);
});

beforeEach(() => {
  mock.timers.enable({ apis: ['setTimeout'] });
});

afterEach(() => {
  mock.timers.reset();
});

test('debounce runs the function once after the wait has passed', () => {
  const func = mock.fn();
  const debounced = debounce(func, 100);

  debounced();
  mock.timers.tick(99);
  assert.equal(func.mock.callCount(), 0);

  mock.timers.tick(1);
  assert.equal(func.mock.callCount(), 1);
});

test('debounce runs a burst of calls once, with the last arguments', () => {
  const func = mock.fn();
  const debounced = debounce(func, 100);

  debounced(1);
  mock.timers.tick(50);
  debounced(2);
  mock.timers.tick(50);
  debounced(3);
  mock.timers.tick(100);

  assert.equal(func.mock.callCount(), 1);
  assert.deepEqual(func.mock.calls[0].arguments, [3]);
});

test('debounce with immediate runs on the leading edge and not again on the trailing edge', () => {
  const func = mock.fn();
  const debounced = debounce(func, 100, true);

  debounced();
  assert.equal(func.mock.callCount(), 1);

  debounced();
  mock.timers.tick(100);
  assert.equal(func.mock.callCount(), 1);
});

test('debounce with immediate runs again once the wait has passed', () => {
  const func = mock.fn();
  const debounced = debounce(func, 100, true);

  debounced();
  mock.timers.tick(100);
  debounced();

  assert.equal(func.mock.callCount(), 2);
});

test('debounce passes this and arguments through', () => {
  const func = mock.fn();
  const context = { debounced: debounce(func, 100) };

  context.debounced('a', 'b');
  mock.timers.tick(100);

  assert.equal(func.mock.calls[0].this, context);
  assert.deepEqual(func.mock.calls[0].arguments, ['a', 'b']);
});

test('transitionFor returns a height transition for a positive speed', () => {
  assert.equal(transitionFor(100), 'height 100ms');
});

test('transitionFor returns an empty string for a speed of 0 or less', () => {
  assert.equal(transitionFor(0), '');
  assert.equal(transitionFor(-5), '');
});

test('transitionFor returns an empty string under reduced motion, whatever the speed', () => {
  assert.equal(transitionFor(100, true), '');
  assert.equal(transitionFor(100, false), 'height 100ms');
});

test('widthOf reads the border box inline size', () => {
  assert.equal(widthOf({ borderBoxSize: [{ inlineSize: 320 }], target: { getBoundingClientRect: () => ({ width: 100 }) } }), 320);
});

test('widthOf falls back to the bounding rect width without borderBoxSize', () => {
  assert.equal(widthOf({ target: { getBoundingClientRect: () => ({ width: 100 }) } }), 100);
});
