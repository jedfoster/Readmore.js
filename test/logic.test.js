import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';

import { debounce, shouldFold, targetHeight, uniqueId } from '../src/logic.js';

test('shouldFold folds a block taller than the collapsed height plus margin', () => {
  assert.equal(shouldFold(400, 200, 16), true);
});

test('shouldFold leaves a block exactly at the collapsed height plus margin alone', () => {
  assert.equal(shouldFold(216, 200, 16), false);
});

test('shouldFold leaves a block shorter than the collapsed height alone', () => {
  assert.equal(shouldFold(100, 200, 16), false);
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
