import { CupoReservadoService } from '../services/postgress/reserva.js';

const cupoReservadoService = new CupoReservadoService();

// ✅ Crear una nueva reserva en estado `PENDIENTE`
export async function crearReserva(req, res) {
    try {
        const { usuarioId, paqueteId, fecha } = req.body;
        const reserva = await cupoReservadoService.crearReserva(usuarioId, paqueteId, fecha);

        res.status(201).json({ message: "Reserva creada en estado PENDIENTE", reserva });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// ✅ Confirmar una reserva (`PENDIENTE` → `RESERVADO`)
export async function confirmarReserva(req, res) {
    try {
        const { reservaId } = req.body;
        const reserva = await cupoReservadoService.confirmarReserva(reservaId);

        res.status(200).json({ message: "Reserva confirmada", reserva });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// ✅ Obtener cupos disponibles en un paquete por fecha
export async function obtenerCupos(req, res) {
    try {
        const { paqueteId, fecha } = req.query;
        const cupos = await cupoReservadoService.obtenerCuposDisponibles(Number(paqueteId), fecha);
        res.status(200).json(cupos);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
