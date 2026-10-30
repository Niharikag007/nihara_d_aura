import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeService, normalizeServiceCategory } from './serviceUtils.js';
import { initialData } from '../data/initialData.js';

test('legacy nail and jewellery services are displayed in Salon without mutating their records', () => {
  const nailService = { id: 'legacy-nails', category: 'Nails' };
  const jewelleryService = { id: 'legacy-styling', category: 'Jewellery & Styling' };

  assert.equal(normalizeService(nailService).category, 'Salon');
  assert.equal(normalizeService(jewelleryService).category, 'Salon');
  assert.equal(nailService.category, 'Nails');
  assert.equal(jewelleryService.category, 'Jewellery & Styling');
});

test('service category normalization preserves Makeup and canonical Salon values', () => {
  assert.equal(normalizeServiceCategory(' makeup '), 'Makeup');
  assert.equal(normalizeServiceCategory('Salon'), 'Salon');
  assert.equal(normalizeServiceCategory('Jewelry & Styling'), 'Salon');
});

test('initial catalogue includes substantive Salon offerings', () => {
  const salonServices = initialData.services.filter((service) => service.category === 'Salon');
  assert.deepEqual(
    salonServices.map((service) => service.id),
    ['srv_signature_spa_manicure', 'srv_restorative_hair_spa', 'srv_signature_salon_pedicure']
  );
  assert.ok(salonServices.every((service) => service.description.length > 40 && service.inclusions.length >= 3));
});
