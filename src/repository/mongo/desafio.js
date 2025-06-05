import { Desafio } from "../../models/desafio.js";

export const DesafioRepository = {
  async create(data) {
    return await Desafio.create(data);
  },

  async findById(id) {
    return await Desafio.findById(id).lean();
  },

  async findByName(desafio) {
    return await Desafio.findOne({ desafio }).lean();
  },

  async findAllPaginated(skip, limit) {
    const desafios = await Desafio.find().lean().skip(skip).limit(limit).sort({ desafio: 1 });
    const total = await Desafio.countDocuments();
    return { desafios, total };
  },

  async updateById(id, updateData) {
    return await Desafio.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deactivateById(id) {
    return await Desafio.findByIdAndUpdate(id, { activo: false }, { new: true });
  },
};
