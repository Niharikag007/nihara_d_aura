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
    'Bridal Jewellery',
    'Jewellery Sets',
    'Couple Jewellery',
    'Personalised Jewellery',
    'Anklets',
    'Gift Boxes'
  ]
};

export const ARTIFICIAL_JEWELLERY_IMAGES = {
  Earrings: '/images/artificial-jewellery/earrings/earring_01.jpeg',
  'Necklaces & Sets': '/images/artificial-jewellery/necklaces/necklace_01.jpeg',
  Rings: '/images/artificial-jewellery/rings/ring_01.png',
  'Bangles & Bracelets': '/images/artificial-jewellery/bracelets/bracelet_01.jpeg',
  Pendants: '/images/artificial-jewellery/pendants/pendant_01.jpeg',
  'Bridal Jewellery': '',
  'Jewellery Sets': '',
  'Couple Jewellery': '',
  'Personalised Jewellery': '',
  Anklets: '',
  'Gift Boxes': ''
};

export const REMOVED_JEWELLERY_PRODUCT_IDS = [
  'prod_diamond_ring',
  'prod_peacock_cocktail_ring',
  'prod_eternity_band',
  'prod_emerald_gold_ring',
  'prod_floral_signet_ring'
];

const seedImageReplacements = {
  prod_choker: {
    source: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/necklaces/necklace_01.jpeg'
  },
  prod_rosegold_diamond_choker: {
    source: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/necklaces/necklace_02.jpeg'
  },
  prod_rosegold_floral_choker: {
    source: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/necklaces/necklace_03.jpeg'
  },
  prod_rosegold_emerald_choker: {
    source: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/necklaces/necklace_04.jpeg'
  },
  prod_rosegold_pearl_choker: {
    source: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/necklaces/necklace_05.jpeg'
  },
  prod_solitaire_studs: {
    source: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/earrings/earring_04.jpeg'
  },
  prod_tikka: {
    source: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    replacement: ''
  },
  prod_pendant_chain: {
    source: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/pendants/pendant_01.jpeg'
  },
  prod_temple_danglers: {
    source: '/images/products/jewellery_temple_gold_jhumkas.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_03.jpeg'
  },
  prod_filigree_jhumka: {
    source: '/images/products/jewellery_temple_gold_jhumkas.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_09.jpeg'
  },
  prod_polki_bridal_set: {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: ''
  },
  prod_kundan_chandbalis: {
    source: '/images/products/jewellery_kundan_chandbalis.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_08.jpeg'
  },
  prod_gold_locket: {
    source: '/images/products/jewellery_lakshmi_gold_locket.jpg',
    replacement: '/images/artificial-jewellery/pendants/pendant_02.jpeg'
  },
  prod_ganesha_pendant: {
    source: '/images/products/jewellery_gold_ganesha_pendant.jpg',
    replacement: '/images/artificial-jewellery/pendants/pendant_03.jpeg'
  },
  prod_evil_eye_pendant: {
    source: '/images/products/jewellery_evil_eye_pendant.jpg',
    replacement: '/images/artificial-jewellery/pendants/pendant_04.jpeg'
  },
  prod_om_sacred_locket: {
    source: '/images/products/jewellery_sacred_om_locket.jpg',
    replacement: '/images/artificial-jewellery/pendants/pendant_05.jpeg'
  },
  prod_temple_kasu_set: {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: '/images/artificial-jewellery/necklaces/necklace_03.jpeg'
  },
  prod_guluband_collar_set: {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: '/images/artificial-jewellery/necklaces/necklace_04.jpeg'
  },
  prod_nakshi_kada: {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_03.jpeg'
  },
  prod_filigree_kangan: {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_06.jpeg'
  },
  prod_peacock_temple_cuff: {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_07.jpeg'
  },
  prod_ruby_gold_bangles: {
    source: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=85',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_04.jpeg'
  },
};

const seedImageReplacementsBySlug = {
  'antique-22k-gold-guluband-collar-earrings-suite': {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: '/images/artificial-jewellery/necklaces/necklace_04.jpeg'
  },
  'mughal-polki-emerald-grand-bridal-haar-set': {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: ''
  },
  'south-indian-temple-gold-kasu-mala-bridal-set': {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: '/images/artificial-jewellery/necklaces/necklace_03.jpeg'
  },
  'royal-22k-gold-kundan-bridal-haar-set': {
    source: '/images/products/jewellery_royal_kundan_haar.jpg',
    replacement: ''
  },
  '22k-solid-gold-carved-antique-kangan-set-of-2': {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_01.jpeg'
  },
  'royal-nakshi-lakshmi-temple-kada': {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_03.jpeg'
  },
  'royal-jaipur-openable-filigree-gold-bangle': {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_06.jpeg'
  },
  'antique-finish-22k-gold-peacock-kada-cuff': {
    source: '/images/products/jewellery_nakshi_temple_kada.jpg',
    replacement: '/images/artificial-jewellery/bracelets/bracelet_07.jpeg'
  },
  '22k-solid-gold-peacock-temple-jhumkas': {
    source: '/images/products/jewellery_temple_gold_jhumkas.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_01.jpeg'
  },
  'antique-22k-gold-lakshmi-temple-danglers': {
    source: '/images/products/jewellery_temple_gold_jhumkas.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_17.jpeg'
  },
  'traditional-rajasthani-filigree-22k-gold-jhumkas': {
    source: '/images/products/jewellery_temple_gold_jhumkas.jpg',
    replacement: '/images/artificial-jewellery/earrings/earring_09.jpeg'
  }
};

const jewelleryTerms = new Set(['jewellery', 'jewelry', 'artificial jewellery', 'fashion jewellery']);

const subcategoryKeywords = {
  Earrings: ['earring', 'earrings', 'jhumka', 'jhumkas', 'chandbali', 'chandbalis', 'chand bali', 'ear stud', 'studs', 'hoop earrings', 'danglers', 'dangler'],
  'Necklaces & Sets': ['necklace', 'necklaces', 'haar', 'choker', 'neck chain', 'necklace set', 'neck set', 'collar', 'guluband', 'mala'],
  Rings: ['ring', 'rings', 'band', 'bands'],
  'Bangles & Bracelets': ['bangle', 'bangles', 'bracelet', 'bracelets', 'kada', 'kadas', 'kangan', 'churi', 'churis', 'cuff bracelet'],
  Pendants: ['pendant', 'pendants', 'locket', 'lockets', 'talisman', 'mangalsutra'],
  'Bridal Jewellery': ['bridal', 'bride', 'wedding', 'bridal set', 'bridal haar', 'wedding set', 'wedding suite', 'suite', 'maang tikka'],
  'Jewellery Sets': ['jewellery set', 'jewelry set', 'necklace set', 'necklace and ring set', 'necklace and earrings set'],
  'Couple Jewellery': ['couple jewellery', 'couple jewelry', 'couple ring', 'couple necklace', 'couple bracelet', 'couple set'],
  'Personalised Jewellery': ['personalised', 'personalized', 'custom name', 'name necklace', 'initial necklace'],
  Anklets: ['anklet', 'anklets', 'payal'],
  'Gift Boxes': ['gift box', 'gift boxes', 'gift hamper', 'jewellery box', 'jewelry box']
};

export function isArtificialJewellery(productOrCategory) {
  const category = typeof productOrCategory === 'string'
    ? productOrCategory
    : `${productOrCategory?.category || ''} ${productOrCategory?.categorySlug || ''} ${productOrCategory?.collection || ''}`;
  const normalized = category.toLowerCase().trim();

  return normalized.split(/[\s/_-]+/).some((part) => jewelleryTerms.has(part))
    || normalized.includes('jewellery')
    || normalized.includes('jewelry');
}

export function matchesJewellerySubcategory(product, subcategory) {
  return ARTIFICIAL_JEWELLERY.subcategories.includes(subcategory)
    && getJewellerySubcategory(product) === subcategory;
}

export function getJewellerySubcategory(product) {
  const text = `${product?.name || ''} ${product?.slug || ''}`.toLowerCase();
  const matches = (keywords) => keywords.some((keyword) => {
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(^|[^a-z])${escapedKeyword}($|[^a-z])`).test(text);
  });

  if (matches(['bridal', 'bride', 'wedding', 'maang tikka'])) return 'Bridal Jewellery';
  if (matches(subcategoryKeywords['Gift Boxes'])) return 'Gift Boxes';
  if (matches(subcategoryKeywords['Personalised Jewellery'])) return 'Personalised Jewellery';
  if (matches(subcategoryKeywords['Couple Jewellery'])) return 'Couple Jewellery';
  if (matches(subcategoryKeywords.Anklets)) return 'Anklets';
  if (matches(subcategoryKeywords['Jewellery Sets'])) return 'Jewellery Sets';
  if (matches(subcategoryKeywords['Bangles & Bracelets'])) return 'Bangles & Bracelets';
  if (matches(subcategoryKeywords.Rings)) return 'Rings';
  if (matches(subcategoryKeywords.Pendants)) return 'Pendants';
  if (matches(subcategoryKeywords['Necklaces & Sets'])) return 'Necklaces & Sets';
  if (matches(subcategoryKeywords.Earrings)) return 'Earrings';

  return ARTIFICIAL_JEWELLERY.subcategories.includes(product?.subcategory)
    ? product.subcategory
    : 'Necklaces & Sets';
}

// --- REAL IMAGE PRIORITY: Always show uploaded image first, no dummy fallbacks ---

const BACKEND_STATIC_BASE = (
  import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    : (import.meta.env?.PROD ? 'https://api.niharadaura.com' : 'http://localhost:3000')
).replace(/\/+$/, '');

function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  // If it's stored as relative /uploads/..., prepend backend URL
  if (trimmed.startsWith('/uploads/')) {
    return `${BACKEND_STATIC_BASE}${trimmed}`;
  }
  return trimmed;
}

export function getProductImages(product) {
  // 1. Uploaded single image (from admin panel upload / backend)
  if (product?.image && typeof product.image === 'string' && product.image.trim()) {
    return [resolveImageUrl(product.image)];
  }

  // 2. Uploaded images array
  const productImages = Array.isArray(product?.images)
    ? product.images
        .filter((image) => typeof image === 'string' && image.trim())
        .map((img) => resolveImageUrl(img))
    : [];

  if (productImages.length > 0) return productImages;

  // 3. No image at all — return empty so caller shows "No Image" placeholder
  return [];
}

export function getProductFallbackImage() {
  // Intentionally returns null — no dummy/stock fallback images
  return null;
}

export function getProductImage(product, index = 0) {
  const images = getProductImages(product);
  return images[index] || images[0] || null;
}

export function getProductImageAlt(product) {
  return product?.name || 'Product image';
}
