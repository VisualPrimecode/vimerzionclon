import { transporter } from "../config/emailConfig.js";
import { EMAIL_DEST } from "../config/config.js";
// Servicio centralizado para notificaciones
export class NotificationService {
  static async sendOrderCreatedEmail(usuarioId, paquetes, direccionEnvio, telefonoContacto) {
    const htmlContent = `
      <h1>Nuevo Pedido</h1>
      <p><strong>Usuario ID:</strong> ${usuarioId}</p>
      <p><strong>Teléfono:</strong> ${telefonoContacto}</p>
      <p><strong>Dirección de Envío:</strong> ${direccionEnvio}</p>
      <p><strong>Paquetes:</strong></p>
      <ul>
        ${paquetes.map(p => `<li>${p.paqueteId} - ${p.cantidad} unidades</li>`).join('')}
      </ul>
    `;
    const subject = 'Nuevo Pedido Creado';

    try {
      await transporter.sendMail({
        from: `"Tu Empresa" <${transporter.options.auth.user}>`,
        to: usuarioId,
        subject,
        html: htmlContent,
      });
      console.log('Correo de nuevo pedido enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el correo de nuevo pedido:', error);
      throw new Error('No se pudo enviar el correo de nuevo pedido.');
    }
  }

  static async sendOrderConfirmedEmail(usuarioEmail, transactionResult) {
    const htmlContent = `
      <h1>Confirmación de Pedido</h1>
      <p><strong>Número de Orden:</strong> ${transactionResult.buy_order}</p>
      <p><strong>Estado:</strong> PAGADO</p>
      <p><strong>Monto:</strong> ${transactionResult.amount}</p>
      <p><strong>Código de Autorización:</strong> ${transactionResult.authorization_code}</p>
    `;
    const subject = 'Confirmación de Pedido';

    try {
      await transporter.sendMail({
        from: `"Tu Empresa" <${transporter.options.auth.user}>`,
        to: usuarioEmail,
        subject,
        html: htmlContent,
      });
      console.log('Correo de confirmación de pedido enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el correo de confirmación de pedido:', error);
      throw new Error('No se pudo enviar el correo de confirmación de pedido.');
    }
  }

  static async sendOrderFailedEmail(usuarioEmail, reason) {
    const htmlContent = `
      <h1>Pedido Fallido</h1>
      <p><strong>Razón del fallo:</strong> ${reason}</p>
    `;
    const subject = 'Fallo en el Pedido';

    try {
      await transporter.sendMail({
        from: `"Tu Empresa" <${transporter.options.auth.user}>`,
        to: usuarioEmail,
        subject,
        html: htmlContent,
      });
      console.log('Correo de fallo en pedido enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el correo de fallo en pedido:', error);
      throw new Error('No se pudo enviar el correo de fallo en pedido.');
    }
  }

  static async sendContactEmail(nombre_solicitante, empresa, cargo, servicios, mensaje, correo) {
    
    // Si "servicios" es un array, conviértelo a una lista en HTML
    const serviciosList = Array.isArray(servicios)
  ? servicios.map((servicio) => `<li>${servicio}</li>`).join('')
  : `<li>${servicios}</li>`;

const htmlContent = `
  <h1>Nuevo Mensaje de Contacto</h1>
  <p><strong>Nombre del Solicitante:</strong> ${nombre_solicitante}</p>
  <p><strong>Correo del Solicitante:</strong> ${correo}</p>
  <p><strong>Empresa:</strong> ${empresa}</p>
  <p><strong>Cargo:</strong> ${cargo}</p>
  <p><strong>Servicios:</strong></p>
  <ul>${serviciosList}</ul>
  <p><strong>Mensaje:</strong> ${mensaje}</p>
`;

    const subject = 'Nuevo Mensaje de Contacto';
    const to = EMAIL_DEST; // Email fijo desde variable de entorno
  
    try {
      await transporter.sendMail({
        from: `"Tu Empresa" <${transporter.options.auth.user}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log('Correo de contacto enviado correctamente.');
    } catch (error) {
      console.error('Error al enviar el correo de contacto:', error);
      throw new Error('No se pudo enviar el correo de contacto.');
    }
  }
  

  static async sendOrderStatusUpdateEmail(usuarioEmail, { buy_order, amount, estado, paquetes, direccionEnvio }) {
    let subject;
    let estadoMensaje;
  
    // Personalizar el asunto y mensaje según el estado
    if (estado === 'COMPLETADO') {
      subject = 'Tu pedido ha sido completado';
      estadoMensaje = 'Nos alegra informarte que tu pedido ha sido completado exitosamente.';
    } else if (estado === 'CANCELADO') {
      subject = 'Tu pedido ha sido cancelado';
      estadoMensaje = 'Lamentamos informarte que tu pedido ha sido cancelado.';
    } else {
      subject = `Actualización de estado: ${estado}`;
      estadoMensaje = `El estado de tu pedido ha cambiado a ${estado}.`;
    }
  
    const htmlContent = `
      <h1>${subject}</h1>
      <p>Hola,</p>
      <p>${estadoMensaje}</p>
      <p><strong>Número de orden:</strong> ${buy_order}</p>
      <p><strong>Monto total:</strong> $${amount}</p>
      <h3>Detalles del pedido:</h3>
      <ul>
        ${paquetes.map(
          (paquete) =>
            `<li>${paquete.nombre} - ${paquete.cantidad} unidades - $${paquete.precioUnitario}</li>`
        ).join('')}
      </ul>
      <p><strong>Dirección de envío:</strong> ${direccionEnvio}</p>
      <p>Gracias por tu preferencia. Si tienes alguna pregunta, no dudes en contactarnos.</p>
    `;
  
    try {
      await transporter.sendMail({
        from: `"Tu Empresa" <${transporter.options.auth.user}>`,
        to: usuarioEmail,
        subject,
        html: htmlContent,
      });
      console.log(`Correo de actualización de estado (${estado}) enviado correctamente.`);
    } catch (error) {
      console.error(`Error al enviar el correo de actualización de estado (${estado}):`, error);
      throw new Error(`No se pudo enviar el correo de actualización de estado (${estado}).`);
    }
  }
  
}


