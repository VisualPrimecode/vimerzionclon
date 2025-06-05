import { Servicio } from "../../models/service.js";

export const ServicioRepository = {
  async create(data) {
    return await Servicio.create(data);
  },

  async findById(id) {
    return await Servicio.findById(id).lean();
  },

  async findByName(titulo) {
    return await Servicio.findOne({ titulo: titulo }).lean();
  },

  async findAllPaginated(skip, limit) {
    const servicios = await Servicio.find().lean().skip(skip).limit(limit).sort({ titulo: 1 });
    const total = await Servicio.countDocuments();
    return { servicios, total };
  },

  async updateById(id, updateData) {
    return await Servicio.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deactivateById(id) {
    return await Servicio.findByIdAndUpdate(id, { activo: false }, { new: true });
  },
};
