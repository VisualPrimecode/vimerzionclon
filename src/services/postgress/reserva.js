import { ReservaRepository } from '../../repository/postgress/reserva.js';
import { PaqueteRepository } from '../../repository/postgress/package.js';

export class CupoReservadoService {
  constructor() {
    this.reservaRepository = new ReservaRepository(); // ✅ Usando el nombre correcto
    this.paqueteRepository = new PaqueteRepository();
  }

  async crearReserva(usuarioId, paqueteId, fecha) {
    try {
        console.log(fecha)
        // 📌 Forzar a solo fecha (eliminar horas) usando `.setUTCHours(0,0,0,0)`
        const fechaReserva = new Date(fecha);
        fechaReserva.setUTCHours(0, 0, 0, 0); // 🔥 Asegura que se tome a las 00:00:00 en UTC

        console.log("📆 Fecha de reserva:", fechaReserva);

        const paquete = await this.paqueteRepository.findById(paqueteId);
        if (!paquete || !paquete.activo) {
            throw new Error("El paquete no está disponible.");
        }

        if (fechaReserva < new Date(paquete.fechaInicio) || fechaReserva > new Date(paquete.fechaFin)) {
            throw new Error("Fecha fuera del rango permitido.");
        }

        // ✅ Obtener el día de la semana correctamente
        const opcionesFormato = { weekday: 'long', timeZone: 'UTC' }; // 🔹 Evita la conversión de zona horaria
        const diaSemana = fechaReserva.toLocaleDateString('es-ES', opcionesFormato)
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // 🔥 Remueve tildes
            .toUpperCase(); // 🔹 Convierte a mayúsculas

        // ✅ Normalizar `diasDisponibles` para comparación exacta
        const diasDisponibles = paquete.diasDisponibles.map(dia =>
            dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
        );

        if (!diasDisponibles.includes(diaSemana)) {
            throw new Error(`El día seleccionado (${diaSemana}) no está disponible para este paquete.`);
        }

        
        // ✅ Validar cupos disponibles
        const cuposReservados = await this.reservaRepository.contarCuposReservados(paqueteId, fechaReserva);
        if (cuposReservados >= paquete.cuposDiarios) {
            throw new Error("No hay cupos disponibles para esta fecha.");
        }

        // ✅ Crear reserva en estado PENDIENTE y devolver el ID
        const reserva = await this.reservaRepository.reservarCupo(usuarioId, paqueteId, fechaReserva);
        return { id: reserva.id, fecha: reserva.fecha }; // Devuelve el ID y la fecha de la reserva

    } catch (error) {
        console.error("Error al crear la reserva:", error);
        throw new Error(error.message || "Error al procesar la reserva.");
    }
}


  async confirmarReserva(reservaId) {
    try {
      return await this.reservaRepository.confirmarReserva(reservaId);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      throw new Error(error.message || "Error al confirmar la reserva.");
    }
  }

   // ✅ Obtener cupos disponibles de un paquete por día
async obtenerCuposDisponibles(paqueteId, fecha) {
    const fechaReserva = new Date(fecha);
    fechaReserva.setUTCHours(0, 0, 0, 0);
    console.log("📆 Fecha ingresada:", fechaReserva);

    const paquete = await this.paqueteRepository.findById(paqueteId);
    if (!paquete || !paquete.activo) {
        throw new Error("El paquete no está disponible.");
    }

    // 🔹 Mapeo de los días de la semana en español
    const diasSemana = ["DOMINGO", "LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

    // 🔹 Obtener el día de la semana de la fecha seleccionada
    const diaSemana = diasSemana[fechaReserva.getUTCDay()]; 

    // 🔹 Convertir los días disponibles a mayúsculas sin acentos
    const diasDisponibles = paquete.diasDisponibles.map(dia =>
        dia.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
    );

    console.log("📆 Día de la semana detectado:", diaSemana);
    console.log("📅 Días disponibles en el paquete:", diasDisponibles);

    // 🔹 Si el día seleccionado no está en los días disponibles, devolver mensaje
    if (!diasDisponibles.includes(diaSemana)) {
        return {
            fecha: fechaReserva.toISOString().split("T")[0],
            mensaje: `El paquete no está disponible para el día ${diaSemana}.`,
            diasDisponibles,
            disponible: false
        };
    }

    // 🔹 Validar si la fecha está dentro del rango permitido
    const fechaInicio = new Date(paquete.fechaInicio);
    const fechaFin = new Date(paquete.fechaFin);

    if (fechaReserva < fechaInicio || fechaReserva > fechaFin) {
        return {
            fecha: fechaReserva.toISOString().split("T")[0],
            mensaje: "Fecha fuera del rango permitido.",
            fechaInicio: fechaInicio.toISOString().split("T")[0],
            fechaFin: fechaFin.toISOString().split("T")[0],
            diasDisponibles,
            disponible: false
        };
    }

    // 🔹 Contar cupos reservados
    const cuposReservados = await this.reservaRepository.contarCuposReservados(paqueteId, fechaReserva);
    const cuposDisponibles = paquete.cuposDiarios - cuposReservados;

    console.log("✅ Cupos Reservados:", cuposReservados);
    console.log("✅ Cupos Disponibles:", cuposDisponibles);

    return {
        fecha: fechaReserva.toISOString().split("T")[0],
        diaSemana,
        totalCupos: paquete.cuposDiarios,
        cuposReservados,
        cuposDisponibles,
        disponible: cuposDisponibles > 0,
        diasDisponibles
    };
}
async confirmarReserva(reservaId) {
    try {
        return await this.reservaRepository.confirmarReserva(reservaId);
    } catch (error) {
        console.error("Error al confirmar la reserva por paquete:", error);
        throw new Error(error.message || "Error al confirmar la reserva.");
    }
}


}
