import { AuthService } from '../services/postgress/auth.js';

export async function loginUser(req, res) {
  console.log('📥 Nueva solicitud de inicio de sesión recibida.');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    const authService = new AuthService();

    // Llamar al servicio de autenticación
    const { token, user } = await authService.login(email, password); // <- ahora recibimos también el usuario

    // Configurar la cookie con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Cambiar a true en producción con HTTPS
      sameSite: 'none', // Cambiar a 'none' en producción con HTTPS
      maxAge: 86400000, // 1 día
    });
    console.log('🧾 Usuario:', user);
    // Aquí puedes agregar más lógica si es necesario, como registrar el inicio de sesión
    // Devolver email (y otros datos si quieres) en la respuesta
    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        email: user.email,
        id: user.id, // opcional
        username: user.username, // opcional si lo tienes
        role: user.role, // opcional si lo tienes
        puntos: user.puntos, // opcional si lo tienes
      }
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


export async function logoutUser(req, res) {
  try {
    // Llamar al servicio de logout
    const authService = new AuthService();

    // El servicio maneja la respuesta directamente
    await authService.logout(req, res);

    // No enviar otra respuesta aquí porque el servicio ya lo hizo
    if (!res.headersSent) {
      return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    }
  } catch (error) {
    console.error('Error en logout:', error);

    // Solo responde si no se ha enviado previamente una respuesta
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
    }
  }
}

export async function isAuthenticated(req, res) {
  const token = req.cookies.token;
 
  // Llamar al servicio de logout
  const authService=new AuthService();


  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'No autenticado' });
  }

  try {
    const response = authService.isAuthenticated(token);
    return res.status(200).json({ authenticated: response.authenticated, message: 'Autenticado' });
  } catch (error) {
    return res.status(401).json({ authenticated: false, message: error.message });
  }
}

export async function getRoleFromToken(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no encontrado' });
  }
  const authService=new AuthService();


  
  try {
    const response = authService.getRoleFromToken(token);
    return res.status(200).json({ role: response.role, message: 'Rol recuperado con éxito' });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
}

export async function getRemainingTime(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ remainingTime: 0, message: 'No autenticado' });
  }
 
  const authService=new AuthService();

  try {
    const response = authService.getRemainingTime(token);
    return res.status(200).json({ remainingTime: response.remainingTime, message: 'Tiempo restante calculado con éxito' });
  } catch (error) {
    return res.status(500).json({ remainingTime: 0, message: error.message });
  }
}

export async function getIdFromToken(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no encontrado' });
  }

  const authService=new AuthService();

  try {
    const response = authService.getIdFromToken(token);
    return res.status(200).json({ id: response.id, message: 'ID del usuario recuperado con éxito' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}