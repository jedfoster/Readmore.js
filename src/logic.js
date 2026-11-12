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

export function targetHeight({ expanded, expandedHeight, collapsedHeight }) {
  return expanded ? expandedHeight : collapsedHeight;
}

export function resolveCollapsedHeight({ option, element, cssMaxHeight }) {
  if (typeof option === 'function') {
    const fromFunction = Number(option(element));

    if (Number.isFinite(fromFunction)) {
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
