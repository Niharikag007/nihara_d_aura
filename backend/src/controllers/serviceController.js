import { Service, Artist } from '../models/Service.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { initialData } from '../data/initialData.js';

export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    return successResponse(res, { services });
  } catch (err) {
    next(err);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let service = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(id);
    }
    if (!service) {
      service = await Service.findOne({ $or: [{ slug: id }, { id: id }] });
    }
    if (!service) return errorResponse(res, 'Service not found', 404);
    return successResponse(res, { service });
  } catch (err) {
    next(err);
  }
};

export const getArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find();
    return successResponse(res, { artists });
  } catch (err) {
    next(err);
  }
};

export const getSalon = async (req, res, next) => {
  try {
    const salon = initialData.salon || {
      name: "Nihara D'Aura Flagship Haute Salon",
      address: "423 A, 4th Floor, Tower 3, NX One Tower, Greater Noida (West), UP - 201306",
      timings: "10:00 AM - 08:30 PM (All 7 Days)",
      phone: "+91 92660 59846"
    };
    return successResponse(res, { salon });
  } catch (err) {
    next(err);
  }
};
