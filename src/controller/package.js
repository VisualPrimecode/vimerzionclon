// controllers/paqueteController.js
import { PaqueteService } from '../services/postgress/package.js';
import { subirArchivoAFirebase, eliminarArchivoAntiguo } from '../utils/firebaseUtil.js';

export async function createPaquete(req, res) {
    try {
        // Validar los datos del paquete
        const { 
            nombre, 
            descripcion, 
            precio, 
            stock,
            fechaInicio, 
            fechaFin, 
            diasDisponibles,
            cuposDiarios
        } = req.body;

        // Validar que viene una imagen
        if (!req.file) {
            return res.status(400).json({ 
                error: 'Debe proporcionar una imagen para el paquete' 
            });
        }

       
        // Subir la imagen a Firebase
        const foto = await subirArchivoAFirebase(
            req.file, 
            'paquetes', 
            'imagen de paquete'
        );

        // Crear el paquete con la URL de la imagen
        const paqueteData = {
            nombre,
            descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
            fechaFin: fechaFin ? new Date(fechaFin) : undefined,
            diasDisponibles: diasDisponibles ? JSON.parse(diasDisponibles) : [], // La conversión se mantiene aquí
            cuposDiarios: parseInt(cuposDiarios),
            foto,
            activo: true
        };

        const paqueteService = new PaqueteService();
        const nuevoPaquete = await paqueteService.createPaquete(paqueteData);

        res.status(201).json({
            message: 'Paquete creado exitosamente',
            data: nuevoPaquete
        });

    } catch (error) {
        console.error('Error al crear paquete:');
        // Si algo falla, asegurarse de eliminar la imagen si se llegó a subir
        if (req.file && req.file.firebaseUrl) {
            await eliminarArchivoAntiguo(req.file.firebaseUrl);
        }
        res.status(400).json({ 
            error:  'Error al crear el paquete' 
        });
    }
}

export async function updatePaquete(req, res) {
    try {
        const { id } = req.params;
        const numberId=Number(id)
        const {
            nombre,
            descripcion,
            precio,
            stock,
            fechaInicio, 
            fechaFin, 
            diasDisponibles,
            cuposDiarios,
            activo,
            
        } = req.body;

        const paqueteService = new PaqueteService();
        
        // Obtener el paquete actual para la imagen anterior
        const paqueteActual = await paqueteService.getPaqueteById(id);
        if (!paqueteActual) {
            return res.status(404).json({ 
                error: 'Paquete no encontrado' 
            });
        }

        // Preparar datos de actualización
        const updateData = {
            nombre,
            descripcion,
            precio: precio ? parseFloat(precio) : undefined,
            stock: stock ? parseInt(stock) : undefined,
            fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
            fechaFin: fechaFin ? new Date(fechaFin) : undefined,
            diasDisponibles: diasDisponibles ? JSON.parse(diasDisponibles) : [], // La conversión se mantiene aquí
            cuposDiarios: parseInt(cuposDiarios),
            activo: activo !== undefined ? JSON.parse(activo.toLowerCase()) : undefined
        };

        // Si hay una nueva imagen, procesarla
        if (req.file) {
            const nuevaFoto = await subirArchivoAFirebase(
                req.file, 
                'paquetes', 
                'imagen de paquete'
            );
            updateData.foto = nuevaFoto;

            // Eliminar la imagen anterior
            await eliminarArchivoAntiguo(paqueteActual.foto);
        }

        // Actualizar el paquete
        const paqueteActualizado = await paqueteService.updatePaquete(numberId, updateData);

        res.json({
            message: 'Paquete actualizado exitosamente',
            data: paqueteActualizado
        });

    } catch (error) {
        console.error('Error al actualizar paquete:', error);
        res.status(400).json({ 
            error: error.message || 'Error al actualizar el paquete' 
        });
    }
}

export async function  getDaysAvailable(req,res){
    try{
        const { id } = req.params;

        const paqueteService= new PaqueteService();
        const paquete= await paqueteService.getDaysAvailable(id);
        return res.status(200).json({
            message: 'Dias Disponibles',
            ...paquete
        });
    }catch(error){
        return res.status(400).json({
            error:  'Error al crear el paquete' 
        })
    }
}
export async function getPaquetesActivos(req, res) {
    try {
      const paqueteService = new PaqueteService();
  
      // Obtener los parámetros de paginación
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 5;
  
      // Llamar al servicio con paginación
      const paquetesActivos = await paqueteService.getPaquetesActivos(page, limit);


        // Convertir la respuesta a un array si no lo está
        const paquetesArray = Object.values(paquetesActivos);
  
      return res.status(200).json({
        message: 'Paquetes activos obtenidos exitosamente',
        paquetes: paquetesArray,
      });
    } catch (error) {
      console.error('Error al obtener paquetes activos:');
      return res.status(500).json({
        error:  'Error al obtener los paquetes activos'
      });
    }
  }
  

export async function getPaqueteById(req, res) {
    try {
        const { id } = req.params;

        const paqueteService = new PaqueteService();
        const paquete = await paqueteService.getPaqueteById(id); // El servicio manejará la conversión y validación

        return res.status(200).json({
            message: 'Paquete Encontrado',
            ...paquete
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            error:  'Error al obtener el paquete'
        });
    }
}

export async function deactivatePaquete(req, res) {
    try {
        const { id } = req.params;
        const paqueteService = new PaqueteService();
        const paqueteDesactivado = await paqueteService.deactivatePaquete(id);

        res.json({
            message: 'Paquete desactivado exitosamente',
            data: paqueteDesactivado
        });

    } catch (error) {
        console.error('Error al desactivar paquete:');
        res.status(400).json({ 
            error:  'Error al desactivar el paquete' 
        });
    }
}

export async function getAllPackagePaginated(req, res) {
    try {
      const paqueteService = new PaqueteService();
  
      // Obtener los parámetros de paginación desde la query string
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
  
      // Llamar al servicio para obtener los paquetes paginados
      const paginatedPackages = await paqueteService.getAllPackagePaginated(page, limit);
  
      return res.status(200).json({
        message: 'Paquetes obtenidos exitosamente',
        ...paginatedPackages,
      });
    } catch (error) {
      console.error('Error al obtener paquetes paginados:');
      return res.status(500).json({
        error:  'Error al obtener los paquetes',
      });
    }
  }
  