export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[()[\]/\\]/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function categoryLabel(slug: string): string {
  const map: Record<string, string> = {
    'apis': "API's",
    'intermediates': 'Intermediates',
    'industrial-chemicals': 'Industrial Chemicals',
    'nutraceuticals': 'Nutraceuticals',
    'herbal-extracts': 'Herbal Extracts',
    'excipients': 'Excipients',
    'dyes-and-intermediates': 'Dyes & Intermediates',
    'impurities': 'Impurities & Reference Standards',
    'food-chemicals': 'Food Chemicals',
    'pellets': 'Pellets',
    'organic-inorganic': 'Organic & Inorganic',
  }
  return map[slug] ?? slug
}
