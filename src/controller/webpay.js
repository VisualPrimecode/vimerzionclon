// src/controller/webpay.js
import { OrdenService } from '../services/postgress/order.js';
import { FRONTEND_URL } from '../config/config.js';
const ordenService = new OrdenService();

export async function handleWebpayReturn(req, res) {
  try {
    const token_ws = req.method === 'POST' ? req.body.token_ws : req.query.token_ws;
    const TBK_TOKEN = req.method === 'POST' ? req.body.TBK_TOKEN : req.query.TBK_TOKEN;
    const TBK_ORDEN_COMPRA = req.method === 'POST' ? req.body.TBK_ORDEN_COMPRA : req.query.TBK_ORDEN_COMPRA;

    // Si se recibe TBK_TOKEN, la transacción fue cancelada
    if (TBK_TOKEN) {
      console.log(`🟥 Transacción cancelada. Token: ${TBK_TOKEN}, Orden: ${TBK_ORDEN_COMPRA}`);
      if (TBK_ORDEN_COMPRA) {
        const ordenId = Number(TBK_ORDEN_COMPRA.split('-')[1]);
        await ordenService.updateOrdenStatus(ordenId, 'CANCELADO');
        await ordenService.updateTransbankPaymentStatus(TBK_TOKEN)
      }
      return res.redirect(`${FRONTEND_URL}/webpay/return?token=${TBK_TOKEN}&status=cancelled`);
    }

    if (!token_ws) {
      console.error('🟥 token_ws no proporcionado.');
      return res.redirect(`${FRONTEND_URL}/webpay/return?message=token-missing`);
    }

    const result = await ordenService.confirmWebpayTransaction(token_ws);

    // Redirigir según el resultado
    if (result.response_code === 0) {
      console.log(`✅ Transacción exitosa. Orden: ${result.buy_order}, Monto: ${result.amount}`);
      return res.redirect(
        `${FRONTEND_URL}/webpay/return?token=${token_ws}&orderId=${result.buy_order}&total=${result.amount}`
      );
    } else {
      console.log(`🟥 Transacción rechazada. Código: ${result.response_code}`);
      const ordenId = Number(TBK_ORDEN_COMPRA.split('-')[1]);
        await ordenService.updateOrdenStatus(ordenId, 'CANCELADO');
        await ordenService.updateTransbankPaymentStatus(TBK_TOKEN)
      return res.redirect(
        `${FRONTEND_URL}/webpay/return?token=${token_ws}&code=${result.response_code}`
      );
    }
  } catch (error) {
    console.error('Error en confirmación Webpay:', error);
    return res.redirect(
      `${FRONTEND_URL}/webpay/return?message=${encodeURIComponent(error.message)}`
    );
  }
}


export async function getTransactionStatus(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      console.error('🟥 Token no proporcionado.');
      return res.status(400).json({
        error: 'Token no proporcionado',
      });
    }

    console.log(`🔍 Consultando estado de la transacción para el token: ${token}`);
    const status = await ordenService.getTransactionStatus(token);

    console.log(`🔍 Estado obtenido:`, status);
    return res.status(200).json({
      data: status,
    });
  } catch (error) {
    console.error('Error al obtener estado:', error);
    return res.status(500).json({
      error: 'Error al obtener el estado de la transacción',
    });
  }
}
