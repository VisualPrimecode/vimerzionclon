import { Tecnologia } from "../../models/tecnology.js";

export const TecnologiaRepository = {
  async create(data) {
    return await Tecnologia.create(data);
  },

  async findById(id) {
    return await Tecnologia.findById(id).lean();
  },

  async findByName(nombre) {
    return await Tecnologia.findOne({ nombre }).lean();
  },

  async findAllPaginated(skip, limit) {
    const tecnologias = await Tecnologia.find().lean().skip(skip).limit(limit).sort({ nombre: 1 });
    const total = await Tecnologia.countDocuments();
    return { tecnologias, total };
  },

  async updateById(id, updateData) {
    return await Tecnologia.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deactivateById(id) {
    return await Tecnologia.findByIdAndUpdate(id, { activo: false }, { new: true });
  },
};
