import { UserRepository } from '../../repository/postgress/user.js';
import { generateToken,verifyToken } from '../../utils/jwtUtil.js';
import { comparePassword } from '../../utils/bcryptUti.js';


export class AuthService{
  
async login(email, password) {
  const userService = new UserRepository();
  const user = await userService.findByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');

  const isPasswordValid = await comparePassword(password, user.hashedPassword);
  if (!isPasswordValid) throw new Error('Contraseña incorrecta');

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.rol.nombre,
  });

  // Retornar tanto el token como algunos datos del usuario
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre, // o como se llame el campo
      role: user.rol.nombre
    }
  };
}

  async logout(req, res) {
    try {
        // Limpia la cookie del token
        res.clearCookie('token', {
            httpOnly: true,
            secure: true, // Cambiar a true en producción con HTTPS
            sameSite: 'none', // Cambiar a 'none' en producción con HTTPS
            path: '/',
        });

        // Envía la respuesta de éxito
        return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        // Captura cualquier error y responde una sola vez
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
        }
    }
}

   isAuthenticated(token) {
    if (!token) throw new Error('No autenticado');
    verifyToken(token); // Valida el token
    return { authenticated: true };
  }

  getRoleFromToken(token) {
    if (!token) throw new Error('Token no encontrado');
    const decoded = verifyToken(token);
    return { role: decoded.role };
  }

  getTokenExpirationDate(token) {
    const decoded = verifyToken(token);
    if (decoded.exp) {
      const expirationDate = new Date(0); // UNIX epoch
      expirationDate.setUTCSeconds(decoded.exp);
      return expirationDate;
    }
    throw new Error('Token sin fecha de expiración');
  }

  getRemainingTime(token) {
    const expirationDate = this.getTokenExpirationDate(token);
    const remainingTime = expirationDate.valueOf() - Date.now();
    return { remainingTime: Math.max(remainingTime, 0) }; // Retorna 0 si ya expiró
  }

  getIdFromToken(token) {
    if (!token) throw new Error('Token no encontrado');
    const decoded = verifyToken(token);
    return { id: decoded._id }; // Retorna el ID del usuario
  }
};
