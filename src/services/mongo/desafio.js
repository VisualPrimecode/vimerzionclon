import { DesafioRepository } from "../../repository/mongo/desafio.js";
import { subirArchivoAFirebase, eliminarArchivoAntiguo } from "../../utils/firebaseUtil.js";

export const DesafioService = {
  async create(data) {
    if (!data.desafio || !data.experiencia || !data.valor || !data.premio || !data.tiempoMaximo || !data.intentos) {
      throw new Error("Faltan campos obligatorios.");
    }
    return await DesafioRepository.create(data);
  },

  async findById(id) {
    const desafio = await DesafioRepository.findById(id);
    if (!desafio) {
      throw new Error("El desafío no fue encontrado.");
    }
    return desafio;
  },

  async findByName(nombre) {
    const desafio = await DesafioRepository.findByName(nombre);
    if (!desafio) {
      throw new Error("El desafío no fue encontrado.");
    }
    return desafio;
  },

  async findAllPaginated(page, limit) {
    const skip = (page - 1) * limit;
    return await DesafioRepository.findAllPaginated(skip, limit);
  },

  async update(id, data) {
    const desafioExistente = await DesafioRepository.findById(id);
    if (!desafioExistente) {
      throw new Error("El desafío no fue encontrado.");
    }
    return await DesafioRepository.updateById(id, {
      ...data,
    });
  },

  async deactivate(id) {
    return await DesafioRepository.deactivateById(id);
  },
};
