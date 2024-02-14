export function toSnakeCase(str: string) {
  const snakeCaseString = str
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  return snakeCaseString;
}
