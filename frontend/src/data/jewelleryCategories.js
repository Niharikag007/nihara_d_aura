export const ARTIFICIAL_JEWELLERY = {
  name: 'Artificial Jewellery',
  slug: 'artificial-jewellery',
  description: 'Explore statement fashion jewellery for everyday wear, celebrations and bridal looks.',
  subcategories: [
    'Earrings',
    'Necklaces & Sets',
    'Rings',
    'Bangles & Bracelets',
    'Pendants',
    'Bridal Jewellery'
  ]
};

const jewelleryTerms = new Set(['jewellery', 'jewelry', 'artificial jewellery', 'fashion jewellery']);

const subcategoryKeywords = {
  Earrings: ['earring', 'earrings', 'jhumka', 'jhumkas', 'chandbali', 'chandbalis', 'chand bali', 'ear stud', 'studs', 'hoop earrings'],
  'Necklaces & Sets': ['necklace', 'necklaces', 'haar', 'choker', 'neck chain', 'necklace set', 'neck set', 'collar'],
  Rings: ['ring', 'rings'],
  'Bangles & Bracelets': ['bangle', 'bangles', 'bracelet', 'bracelets', 'kada', 'kadas', 'cuff bracelet'],
  Pendants: ['pendant', 'pendants', 'locket', 'lockets', 'talisman', 'mangalsutra'],
  'Bridal Jewellery': ['bridal', 'bride', 'wedding', 'kundan', 'polki', 'meenakari', 'temple jewellery']
};

export function isArtificialJewellery(productOrCategory) {
  const category = typeof productOrCategory === 'string'
    ? productOrCategory
    : `${productOrCategory?.category || ''} ${productOrCategory?.categorySlug || ''}`;
  const normalized = category.toLowerCase().trim();

  return normalized.split(/[\s/_-]+/).some((part) => jewelleryTerms.has(part))
    || normalized.includes('jewellery')
    || normalized.includes('jewelry');
}

export function matchesJewellerySubcategory(product, subcategory) {
  const keywords = subcategoryKeywords[subcategory];
  if (!keywords) return false;

  const searchableText = [
    product?.name,
    product?.slug,
    product?.subcategory,
    product?.description,
    ...(Array.isArray(product?.features) ? product.features : [])
  ].filter(Boolean).join(' ').toLowerCase();

  return keywords.some((keyword) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z])${escapedKeyword}($|[^a-z])`).test(searchableText);
  });
}
