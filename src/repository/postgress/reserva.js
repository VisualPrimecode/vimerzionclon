import prisma from '../../config/db/prismaConfig.js';
export class ReservaRepository  {
    async contarCuposReservados(paqueteId, fecha) {
        return await prisma.cupoReservado.count({
          where: {
            paqueteId,
            fecha,
            estado: 'RESERVADO' // Solo cuenta los confirmados
          }
        });
      }
    
      async obtenerReservaPorUsuario(usuarioId, fecha) {
        return await prisma.cupoReservado.findFirst({
          where: { usuarioId, fecha }
        });
      }
    
      async reservarCupo(usuarioId, paqueteId, fecha) {
        return await prisma.cupoReservado.create({
          data: { usuarioId, paqueteId, fecha, estado: "PENDIENTE" }
        });
      }
    
      async confirmarReserva(reservaId) {
        return await prisma.cupoReservado.update({
          where: { id: reservaId },
          data: { estado: "RESERVADO" }
        });
      }
    

}