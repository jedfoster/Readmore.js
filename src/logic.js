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
    return option(element);
  }

  if (Number.isFinite(cssMaxHeight)) {
    return cssMaxHeight;
  }

  return parseInt(option, 10);
}

export function transitionFor(speed) {
  return speed > 0 ? `height ${speed}ms` : '';
}

export function widthOf(entry) {
  return entry.contentBoxSize ? entry.contentBoxSize[0].inlineSize : entry.contentRect.width;
}
