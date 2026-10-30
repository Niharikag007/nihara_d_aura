import mongoose from 'mongoose';

const ServiceCatalogMigrationSchema = new mongoose.Schema({
  key: { type: String, unique: true, required: true },
  appliedAt: { type: Date, default: Date.now }
});

export const ServiceCatalogMigration = mongoose.models.ServiceCatalogMigration
  || mongoose.model('ServiceCatalogMigration', ServiceCatalogMigrationSchema);
