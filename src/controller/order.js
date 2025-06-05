import { OrdenService } from '../services/postgress/order.js';

const ordenService = new OrdenService(); // Instanciar el servicio

// Crear una nueva orden
export async function createOrden(req, res) {
  try {
    const { usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas } = req.body;

    // Validar datos de entrada
    if (
      !usuarioId ||
      !Array.isArray(paquetes) ||
      paquetes.length === 0 ||
      paquetes.some((p) => !p.paqueteId || !p.cantidad) ||
      !direccionEnvio ||
      !telefonoContacto ||
      !metodoPago
    ) {
      return res.status(400).json({ error: 'Todos los campos requeridos deben estar completos y válidos.' });
    }

    // Crear orden
    const nuevaOrden = await ordenService.createOrden({
      usuarioId,
      paquetes,
      direccionEnvio,
      telefonoContacto,
      metodoPago,
      notas,
    });

    return res.status(201).json({
      message: 'Orden creada exitosamente',
      data: nuevaOrden,
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    const statusCode = error.message.includes('no encontrado') ? 404 : 400;
    return res.status(statusCode).json({
      error: error.message || 'Error al crear la orden',
    });
  }
}

// En createOrdenWithWebpay dentro de src/controller/order.js
// En src/controller/order.js
export async function createOrdenWithWebpay(req, res) {
  try {
    const { usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas,costoEnvio } = req.body;
    const returnUrl = `${req.protocol}://${req.get('host')}/api/webpay/return`;

    
    // Mantener todas las validaciones de datos de entrada
    if (
      !usuarioId ||
      !Array.isArray(paquetes) ||
      paquetes.length === 0 ||
      paquetes.some((p) => !p.paqueteId || !p.cantidad || !p.fecha) ||
      !direccionEnvio ||
      !telefonoContacto ||
      costoEnvio==undefined|| 
      !notas
    ) {
      return res.status(400).json({ error: 'Todos los campos requeridos deben estar completos y válidos.' });
    }

    // Llamar al servicio para crear la orden y obtener la URL de la transacción
    const transactionUrl = await ordenService.createOrdenWithWebpay(
      { usuarioId, paquetes, direccionEnvio, telefonoContacto, metodoPago, notas,costoEnvio},
      returnUrl
    );

    // Verificar que la URL contenga el token
    if (!transactionUrl.includes('token_ws=')) {
      throw new Error('URL de transacción inválida: falta el token');
    }

    // Devolver la URL de la transacción
    return res.status(201).json({
      message: 'Orden creada e inicio de transacción exitoso.',
      transactionUrl
    });
  } catch (error) {
    console.error('Error al crear la orden y transacción:');
    return res.status(500).json({ error: 'Error al crear la orden y transacción' });
  }
}

// Confirmar transacción de Webpay
export async function confirmWebpayTransaction(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'El token es requerido.' });
    }

    // Confirmar la transacción en Webpay
    const transactionResult = await ordenService.confirmWebpayTransaction(token);

    return res.status(200).json({
      message: 'Transacción confirmada exitosamente.',
      data: transactionResult,
    });
  } catch (error) {
    console.error('Error al confirmar la transacción:');
    return res.status(500).json({
      error: error.message || 'Error al confirmar la transacción',
    });
  }
}

// Obtener una orden por ID
export async function getOrdenById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'El ID de la orden es requerido.' });
    }

    const orden = await ordenService.getOrdenById(Number(id));
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }

    return res.status(200).json({
      message: 'Orden encontrada',
      data: orden,
    });
  } catch (error) {
    console.error('Error al obtener la orden:');
    return res.status(500).json({
      error:  'Error al obtener la orden',
    });
  }
}

// Actualizar el estado de una orden
export async function updateOrdenStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id || !estado) {
      return res.status(400).json({ error: 'El ID y el estado son requeridos.' });
    }

    const ordenActualizada = await ordenService.updateOrdenStatus(Number(id), estado);

    return res.status(200).json({
      message: 'Estado de la orden actualizado exitosamente',
      data: ordenActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar el estado de la orden:');
    return res.status(500).json({
      error:  'Error al actualizar el estado de la orden',
    });
  }
}

// Obtener órdenes de un usuario con paginación y filtros
export async function getOrdenesByUsuario(req, res) {
  try {
    const { usuarioId } = req.params;
    const { skip, take } = req.query;

    if (!usuarioId || isNaN(Number(usuarioId))) {
      return res.status(400).json({ error: "El ID del usuario debe ser un número válido." });
    }

    // Asegurarse de que skip y take sean números
    const skipValue = Number(skip) || 0;
    const takeValue = Number(take) || 10;

    const ordenes = await ordenService.getOrdenesByIdPaginated(Number(usuarioId), skipValue, takeValue);

    return res.status(200).json({
      message: 'Órdenes encontradas',
      data: ordenes,
      pagination: ordenes.meta,
    });
  } catch (error) {
    console.error('Error al obtener órdenes del usuario:');
    return res.status(500).json({
      error:  'Error al obtener órdenes del usuario',
    });
  }
}

// Obtener todas las órdenes paginadas
export async function getAllOrdenesPaginated(req, res) {
  try {
    const { skip, take } = req.query;

    // Llamar al servicio para obtener todas las órdenes paginadas
    const ordenesPaginadas = await ordenService.getOrdenesPaginated(Number(skip) || 0, Number(take) || 10);

    return res.status(200).json({
      message: 'Órdenes obtenidas exitosamente',
      data: ordenesPaginadas,
    });
  } catch (error) {
    console.error('Error al obtener todas las órdenes:',);
    return res.status(500).json({
      error:  'Error al obtener todas las órdenes',
    });
  }
}

