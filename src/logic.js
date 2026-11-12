let uniqueIdCounter = 0;

export function debounce(func, wait, immediate) {
  let timeout;

  return function debouncedFunc(...args) {
    const callNow = immediate && !timeout;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(this, args);
      }
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(this, args);
    }
  };
}

export function uniqueId() {
  uniqueIdCounter += 1;

  return `rmjs-${uniqueIdCounter}`;
}

export function shouldFold(height, collapsedHeight, heightMargin) {
  return height > collapsedHeight + heightMargin;
}

// That loop flips a block every frame or two; a person resizing the window back to the same width takes far longer.
const loopWindow = 500;

// Folding a block can take the page's scrollbar away, which widens the block and can unfold it, which brings the scrollbar back.
// A block about to fold, right after unfolding, at the width it folded at the flip before is in that loop, so it stays unfolded.
export function isFoldLoop(flips, width, time) {
  return flips.length === 2 && flips[0].folded && flips[0].width === width && time - flips[1].time < loopWindow;
}

export function recordFlip(flips, width, folded, time) {
  return [...flips, { width, folded, time }].slice(-2);
}

export function targetHeight({ expanded, expandedHeight, collapsedHeight }) {
  return expanded ? expandedHeight : collapsedHeight;
}

export function resolveCollapsedHeight({ option, element, cssMaxHeight }) {
  if (typeof option === 'function') {
    const fromFunction = Number(option(element));

    // Infinity is how a function says not to fold the block at all.
    if (Number.isFinite(fromFunction) || fromFunction === Infinity) {
      return fromFunction;
    }
  }

  if (Number.isFinite(cssMaxHeight)) {
    return cssMaxHeight;
  }

  return parseInt(option, 10);
}

export function transitionFor(speed, reducedMotion) {
  return speed > 0 && !reducedMotion ? `height ${speed}ms` : '';
}

export function widthOf(entry) {
  return entry.borderBoxSize ? entry.borderBoxSize[0].inlineSize : entry.target.getBoundingClientRect().width;
}
