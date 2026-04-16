
export function toHash(str) {
  /**
   * Generates a unique, deterministic CSS-safe hash string from a given input.
   * @param {string|Object} str - The input to hash. If an object is provided, it is stringified before processing.
   * @returns {string} A string prefixed with 'css' followed by a 32-bit unsigned integer hash (e.g., "css2847192").
  **/
  let i = 0, out = 11;
  if (str instanceof Object) str = JSON.stringify(str || {});
  while (i < str.length) out = (101 * out + str.charCodeAt(i++)) >>> 0;
  return 'css' + out;
}

export function toKabab(string){
  /**
   * Converts camelCase to kebab-case
   * @param {Object} input - A camelCase string.
   * @returns {string} A kabab-case string.
  **/
  return string.replace(/[A-Z]/g, function(m) {
    return `-${m.toLowerCase()}`;
  });
}
  
export function toCSS(input, parentSelector = "") {
  /**
   * Recursively transforms a JavaScript object into a CSS string representation.
   * This function processes object keys to handle:
   * - **Property Transformation**: Converts camelCase keys to kebab-case.
   * - **At-Rules**: Supports `@media`, `@import`, `@layer`, `@keyframes`, etc.
   * - **Nesting**: Handles descendant selectors and `&` parent references.
   * - **CSS Variables**: Preserves keys starting with `--`.
   * @param {Object} input - The style object containing CSS properties and nested rules.
   * @param {string} [parentSelector=""] - The current CSS selector context (used for recursion).
   * @returns {string} A formatted string of CSS rules and nested blocks.
  **/
  const rules = [], nested = [], results = [];
  for (const [key, value] of Object.entries(input)) {
    // 1. Check for Globals (html and body)
    if (key.startsWith('html') || key.startsWith('body') || key.startsWith('@page')) {
      nested.push(`${toCSS(value, key)}`);
      continue;
    }
    // Import At-Rules
    if (key.startsWith('@layer') && Array.isArray(value)) {
      nested.push(`${key} ${value.join(", ")};`);
      continue;
    }
    // Import At-Rules
    if (key.startsWith('@import')) {
      nested.push(`${key} '${value}';`);
      continue;
    }
    // Wrapper At-Rules
    if (/^@(media|scope|container|supports|layer)/.test(key)) {
      nested.push(`${key} {\n ${toCSS(value, parentSelector)} \n}`);
      continue;
    }
    // Standalone At-Rules
    if (/^@(keyframes|font-face)/.test(key)) {
      nested.push(`${key} { ${toCSS(value, "")} }`);
      continue;
    }
    // Parent Reference (&)
    if (key.startsWith('&')) {
      nested.push(toCSS(value, key.replace(/&/g, parentSelector)));
      continue;
    }
    // Properties (Standard CSS)
    if (typeof value !== "object" || value === null) {
      rules.push(`${toKabab(key)}:${value};`);
      continue;
    }
    // Stringify Array Value
    if (Array.isArray(value)) {
      rules.push(`${toKabab(key)}:${value.join(", ")};`);
      continue;
    }
    // CSS Variables
    if (key.startsWith('--')) {
      rules.push(`${key}: ${value};`);
      continue;
    }
    // Standard Nesting (Descendants)
    const resolved = parentSelector ? `${parentSelector} ${key}` : key;
    nested.push(toCSS(value, resolved));
  }
  // Create the main rule block for the current selector
  if (parentSelector && rules.length > 0) {
    results.push(`${parentSelector} { ${rules.join(" ")} }`);
  }
  // Add all nested blocks (Media queries, child selectors, etc.)
  if (nested.length > 0) results.push(...nested);
  return results.join("\n");
}




