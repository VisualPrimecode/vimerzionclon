import { OrdenRepository } from '../../repository/postgress/order.js';
import { PaqueteRepository } from '../../repository/postgress/package.js';
import { UserRepository } from '../../repository/postgress/user.js';
import { WebpayRepository } from '../../repository/postgress/webpay.js';
import { WebpayService } from '../../services/postgress/webPay.js';
import { NotificationService } from '../email.js';
import { CupoReservadoService } from './reserva.js';

export class OrdenService {
  constructor() {
    this.paqueteRepository = new PaqueteRepository();
    this.ordenRepository = new OrdenRepository();
    this.userRepository = new UserRepository();
    this.webpayRepository = new WebpayRepository();
    this.reservaService = new CupoReservadoService();
  }

  // Crear una orden
  async createOrden({ usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas, costoEnvio }) {
    try {
        
        const usuario = await this.userRepository.findById(usuarioId);
        if (!usuario) throw new Error(`Usuario ${usuarioId} no encontrado`);

        
        // 🔹 Procesamos los paquetes para obtener su información
        const paquetesInfo = await Promise.all(
            paquetes.map(async ({ paqueteId, cantidad, fecha,adicional }) => {
                const paquete = await this.paqueteRepository.findById(paqueteId);
                if (!paquete) throw new Error(`Paquete ${paqueteId} no encontrado`);
                if (!paquete.activo) throw new Error(`Paquete ${paqueteId} no está activo`);
                

                return { ...paquete, cantidad, fecha,adicional };
            })
        );

        let subtotal = 0;
        const ordenPaquetes = await Promise.all(paquetesInfo.map(async (item) => {
          const total = (Number(item.precio) * item.cantidad) + Number(item.adicional || 0);
            subtotal += total;

            // 🔹 Crear reserva en estado "PENDIENTE" y obtener el ID
            const reserva = await this.reservaService.crearReserva(usuarioId, item.id, item.fecha, "PENDIENTE");


            return {
                paqueteId: item.id,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                total,
                reservaId: reserva.id // ✅ Asociamos el ID de la reserva al detalle de la orden
            };
        }));


        const total = subtotal + Number(costoEnvio) ;

        const ordenData = {
            usuarioId,
            subtotal,
            descuentoTotal: 0,
            total,
            direccionEnvio,
            telefonoContacto,
            metodoPago,
            notas,
            estado: 'CREADO'
        };

        // 🔹 Crear la orden con los detalles que ya contienen `reservaId`
        const ordenCreada = await this.ordenRepository.create(ordenData, ordenPaquetes);

        return ordenCreada;
    } catch (error) {
        console.error(`❌ Error al crear la orden`);
        throw new Error(`Error al crear la orden:`);
    }
}






  // Crear una orden con Webpay
  async createOrdenWithWebpay({ usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas, costoEnvio }, returnUrl) {
    try {
      
      const orden = await this.createOrden({ usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas, costoEnvio });
      const sessionId = `SESSION-${orden.id}-${Date.now()}`;
      const transaction = await WebpayService.createTransaction({
        buyOrder: `ORD-${orden.id}`,
        sessionId,
        amount: orden.total,
        returnUrl,
      });

      await this.webpayRepository.createTransaction(orden.id, transaction.token, orden.total, sessionId);
      return transaction.url;
    } catch (error) {
      console.error('Error al crear la orden con Webpay:');
      throw new Error(`Error al crear la orden y procesar el pago:`);
    }
  }

  async confirmWebpayTransaction(token) {
    try {
      const transactionResult = await WebpayService.commitTransaction(token);
      const existingTransaction = await this.webpayRepository.findByToken(token);
  
      if (!existingTransaction) {
        throw new Error(`No se encontró una transacción con el token ${token}`);
      }
  
      const ordenId = Number(transactionResult.buy_order.split('-')[1]);
      const orden = await this.ordenRepository.findById(ordenId);
  
      if (!orden || !orden.usuario) {
        throw new Error(`No se encontró la orden con ID ${ordenId} o no tiene un usuario asociado.`);
      }
  
      const { email } = orden.usuario;
  
      // Si la transacción es exitosa
      if (transactionResult.response_code === 0) {
        // Actualizar transacción como "PAGADO"
        await this.webpayRepository.updateTransaction(token, {
          estadoPago: 'PAGADO',
          authorizationCode: transactionResult.authorization_code,
          paymentTypeCode: transactionResult.payment_type_code,
          responseCode: String(transactionResult.response_code),
          cardNumber: transactionResult.card_detail?.card_number || null,
          installmentsNumber: transactionResult.installments_number || null,
          installmentsAmount: transactionResult.installments_amount || null,
        });

        // Enviar correo de confirmación de pedido
        await NotificationService.sendOrderConfirmedEmail(email, transactionResult);
  
       // ✅ Cambiar cada reserva a estado "RESERVADO" y descontar cupos por separado
       for (const paquete of orden.paquetes) {
        if (!paquete.reservaId) {
            continue;
        }
        try {
            await this.reservaService.confirmarReserva(paquete.reservaId);
        } catch (error) {
            console.error(`❌ Error al actualizar la reserva para el paquete ${paquete.paqueteId}:`, error.message);
        }
    }
        
        // Cambiar el estado de la orden y reducir el stock
        await this.updateOrdenStatus(ordenId, 'EN_PROCESO');
        await this.ordenRepository.decreaseStock(ordenId);
        return transactionResult;
      }
  
      throw new Error("Pago rechazado por Webpay.");
    } catch (error) {
      throw new Error(`Error al confirmar la transacción:`);
    }
  }
  
  
  async updateTransbankPaymentStatus(token){
    this.webpayRepository.updateTransaction(token,{
      estadoPago:'CANCELADO',
      responseCode: 'CANCELLED_BY_USER',
    })
  }
  
    

  async getTransactionStatus(token) {
    try {
      const transactionStatus = await WebpayService.getTransactionStatus(token);
      return transactionStatus;
    } catch (error) {
      console.error('Error al obtener el estado de la transacción:');
      throw new Error(`Error al obtener el estado de la transacción: `);
    }
  }

  async getOrdenById(id) {
    const orden = await this.ordenRepository.findById(id);
    if (!orden) throw new Error('Orden no encontrada');
    return orden;
  }

  async updateOrdenStatus(id, estado) {
    try {
      const orden = await this.ordenRepository.findById(id);
      if (!orden || !orden.usuario) throw new Error(`No se encontró la orden con ID ${id} o no tiene un usuario asociado.`);
      const { email } = orden.usuario;

      const updatedOrden = await this.ordenRepository.updateStatus(id, estado);
      if (!updatedOrden) throw new Error(`No se pudo actualizar el estado de la orden con ID ${id}.`);

      await NotificationService.sendOrderStatusUpdateEmail(email, {
        buy_order: `ORD-${id}`,
        amount: orden.total,
        estado,
        paquetes: orden.paquetes.map((p) => ({ nombre: p.paquete.nombre, cantidad: p.cantidad, precioUnitario: p.precioUnitario })),
        direccionEnvio: orden.direccionEnvio,
        telefonoContacto: orden.telefonoContacto,
      });

      return updatedOrden;
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:');
      throw new Error(`Error al actualizar el estado de la orden:`);
    }
  }

  async getOrdenesPaginated(skip = 0, take = 10) {
    try {
      const paquetes = await this.ordenRepository.findAllOrdenesPaginated(skip, take);
      return paquetes;
    } catch (error) {
      console.error('Error al obtener paquetes paginados:');
      throw new Error(`Error al obtener los paquetes: `);
    }
  }

  async getOrdenesByIdPaginated(userId, skip = 0, take = 10) {
    try {
      const paquetes = await this.ordenRepository.findAllOrdenesByUserPaginated(userId, Number(skip), Number(take));
      return paquetes;
    } catch (error) {
      console.error('Error al obtener paquetes paginados:');
      throw new Error(`Error al obtener los paquetes: `);
    }
  }
}
