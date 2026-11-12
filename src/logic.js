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
