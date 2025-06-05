// src/services/postgress/webPay.js
import transbank from 'transbank-sdk';
import { API_KEY, COMMERCE_CODE } from '../../config/config.js';

const { WebpayPlus, Options, Environment } = transbank;
// Configurar Webpay en PRODUCCIÓN
const options = new Options(COMMERCE_CODE, API_KEY, Environment.Production);
WebpayPlus.configureForProduction(COMMERCE_CODE, API_KEY);

const transaction = new WebpayPlus.Transaction(options);

export class WebpayService {
  static async createTransaction({ buyOrder, sessionId, amount, returnUrl }) {
    try {
      // Validaciones básicas
      if (!buyOrder || !sessionId || !amount || !returnUrl) {
        throw new Error('Faltan parámetros requeridos para la transacción');
      }

      const response = await transaction.create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
      );

      // Construir la URL completa con el token
      const transactionUrl = `${response.url}?token_ws=${response.token}`;
      
      return {
        ...response,
        url: transactionUrl
      };
    } catch (error) {
      console.error('Error al crear transacción de Webpay:', error);
      throw new Error('Error al iniciar transacción con Webpay.');
    }
  }

  static async commitTransaction(token) {
    try {
      const result = await transaction.commit(token);
      return result;
    } catch (error) {
      console.error('Error al confirmar transacción de Webpay:', error);
      throw new Error('Error al confirmar transacción.');
    }
  }

  static async getTransactionStatus(token) {
    try {
      const status = await transaction.status(token);
      return status;
    } catch (error) {
      console.error('Error al obtener estado de la transacción:', error);
      throw new Error('Error al obtener estado de la transacción.');
    }
  }
}