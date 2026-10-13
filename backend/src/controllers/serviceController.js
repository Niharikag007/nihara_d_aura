import { store } from '../services/storeService.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getServices = (req, res, next) => {
  try {
    const services = store.getServices();
    return successResponse(res, { services });
  } catch (err) {
    next(err);
  }
};

export const getServiceById = (req, res, next) => {
  try {
    const service = store.getServiceById(req.params.id);
    if (!service) return errorResponse(res, 'Service not found', 404);
    return successResponse(res, { service });
  } catch (err) {
    next(err);
  }
};

export const getArtists = (req, res, next) => {
  try {
    const artists = store.getArtists();
    return successResponse(res, { artists });
  } catch (err) {
    next(err);
  }
};

export const getSalon = (req, res, next) => {
  try {
    const salon = store.getSalon();
    return successResponse(res, { salon });
  } catch (err) {
    next(err);
  }
};
