/**
 * A small helper for building page elements without a framework.
 */

/**
 * Creates an element.
 * @param {string} tag for example 'button'
 * @param {object} [props] "class" and "text" set the class and text;
 *   keys starting "on" (onclick) attach event handlers; a true or false
 *   value adds or leaves out a yes/no attribute such as "disabled";
 *   anything else becomes an attribute
 * @param {...(Node|string|null)} children added in order; null is skipped
 * @returns {HTMLElement}
 */
export function el(tag, props = {}, ...children) {
  const element = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key === 'class') element.className = value;
    else if (key === 'text') element.textContent = value;
    else if (key.startsWith('on')) element.addEventListener(key.slice(2), value);
    else if (value === true) element.setAttribute(key, '');
    else if (value !== false && value != null) element.setAttribute(key, value);
  }
  element.append(...children.filter((child) => child != null));
  return element;
}

/** Empties a container and puts the given elements in it. */
export function show(container, ...children) {
  container.replaceChildren(...children.filter((child) => child != null));
}

/** Waits for the given number of milliseconds. */
export function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
