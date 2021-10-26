export function getLimitSkip(
  perPage: string,
  page: string,
): { limit: number; skip: number } {
  let limit = 20;
  let skip = 0;

  if (perPage) limit = parseInt(perPage);
  if (page) skip = parseInt(perPage) * parseInt(page);
  return { limit, skip };
}
