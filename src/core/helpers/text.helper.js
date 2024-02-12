/**
 * @param {string} str
 * @return {string}
 */
export function toSnakeCase(str) {
  const snakeCaseString = str
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  return snakeCaseString;
}
