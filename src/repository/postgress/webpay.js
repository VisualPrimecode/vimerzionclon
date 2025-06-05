import prisma from '../../config/db/prismaConfig.js';

export class WebpayRepository {
  async createTransaction(ordenId, token, total, sessionId) {
    try {
      console.log('Creando transacción:', { ordenId, token, total, sessionId });
      return await prisma.transbank.create({
        data: {
          ordenId,
          token,
          total,
          sessionId,
          estadoPago: 'PENDIENTE',
        },
      });
    } catch (error) {
      console.error('Error al crear transacción:', error.message);
      throw new Error('Error al registrar la transacción en la base de datos.');
    }
  }

  async updateTransaction(token, {
    estadoPago,
    authorizationCode,
    paymentTypeCode,
    cardNumber,
    responseCode,
    installmentsNumber,
    installmentsAmount,
  }) {
    try {
      // Verificar que el token existe
      const existingTransaction = await this.findByToken(token);
      if (!existingTransaction) {
        throw new Error(`No se encontró una transacción con el token ${token}`);
      }

      // Filtrar valores undefined
      const updateData = Object.fromEntries(
        Object.entries({
          estadoPago,
          authorizationCode,
          paymentTypeCode,
          cardNumber,
          responseCode,
          installmentsNumber,
          installmentsAmount,
        }).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(updateData).length === 0) {
        throw new Error('No se proporcionaron datos válidos para actualizar la transacción.');
      }

      console.log('Actualizando transacción:', { token, updateData });

      return await prisma.transbank.update({
        where: { token },
        data: updateData,
      });
    } catch (error) {
      console.error('Error al actualizar transacción:', error.message);
      throw new Error('Error al actualizar la transacción en la base de datos.');
    }
  }

  async findByToken(token) {
    try {
      console.log('Buscando transacción por token:', token);
      const transaction = await prisma.transbank.findUnique({
        where: { token },
      });
      if (!transaction) {
        console.warn(`Transacción no encontrada con el token: ${token}`);
      }
      return transaction;
    } catch (error) {
      console.error('Error al buscar transacción:', error.message);
      throw new Error('Error al buscar la transacción en la base de datos.');
    }
  }
}
