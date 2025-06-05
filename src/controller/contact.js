import { NotificationService } from "../services/email.js";

export async function contact(req, res) {
  try {
    console.log('📥 Nueva solicitud de contacto recibida.');
    console.log('🧾 Body recibido:', req.body);

    const { nombre_solicitante, empresa, cargo, servicios, mensaje, correo } = req.body;

    // Validaciones iniciales
    const camposObligatorios = {
      nombre_solicitante,
      empresa,
      cargo,
      servicios,
      mensaje,
      correo
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(correo)) {
  return res.status(400).json({ error: 'El correo electrónico no es válido.' });
}
    const camposFaltantes = Object.entries(camposObligatorios)
      .filter(([_, valor]) => valor === undefined || valor === null || valor === '')
      .map(([clave]) => clave);

    if (camposFaltantes.length > 0) {
      console.warn('⚠️ Faltan campos:', camposFaltantes);
      return res.status(400).json({
        error: `Faltan los siguientes campos obligatorios: ${camposFaltantes.join(', ')}`,
      });
    }

    // Validación de servicios
    if (!Array.isArray(servicios)) {
      console.warn('❌ El campo "servicios" no es un array:', servicios);
      return res.status(400).json({
        error: 'El campo "servicios" debe ser un array.',
      });
    }

    if (servicios.length === 0) {
      console.warn('⚠️ El array "servicios" está vacío');
      return res.status(400).json({
        error: 'Debe seleccionar al menos un servicio.',
      });
    }

    console.log('✅ Datos validados correctamente. Enviando correo...');

    // Enviar correo
    await NotificationService.sendContactEmail(
      nombre_solicitante,
      empresa,
      cargo,
      servicios,
      mensaje,
      correo
    );

    console.log('📤 Correo enviado con éxito');

    return res.status(200).json({
      message: 'Correo enviado correctamente.',
    });
  } catch (error) {
    console.error('❌ Error en el controlador de contacto:', error);
    return res.status(500).json({
      error: 'Ocurrió un error al procesar la solicitud. Inténtelo de nuevo más tarde.',
    });
  }
}
