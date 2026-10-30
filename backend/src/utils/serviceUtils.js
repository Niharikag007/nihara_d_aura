const LEGACY_SALON_CATEGORIES = new Set([
  'nails',
  'jewellery & styling',
  'jewelry & styling'
]);

export const normalizeServiceCategory = (category) => {
  const value = typeof category === 'string' ? category.trim() : '';
  if (value.toLowerCase() === 'makeup') return 'Makeup';
  if (LEGACY_SALON_CATEGORIES.has(value.toLowerCase())) return 'Salon';
  return value;
};

export const normalizeService = (document) => {
  const service = document?.toObject ? document.toObject() : document;
  if (!service) return service;
  return {
    ...service,
    id: service.id || service._id?.toString(),
    category: normalizeServiceCategory(service.category),
    image: service.image || ''
  };
};
