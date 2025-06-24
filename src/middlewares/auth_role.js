import { obtenerUsuarioPorEmail } from "../components/user/user.models.js";
import { verifyToken } from '../services/auth/auth.controllers.js';

export const authRole = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ').pop();
    
    if (!token) {
      return res.status(401).json({
        message: "Token de autorización requerido"
      });
    }

    const tokenData = await verifyToken(token);
    
    if (!tokenData) {
      return res.status(401).json({
        message: "Token inválido o expirado"
      });
    }

    const usuario = await obtenerUsuarioPorEmail(tokenData.email);
    
    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    if ([].concat(roles).includes(usuario.rol.nombre_rol)) {
      req.usuario = usuario; // Add user to request for use in controllers
      next();
    } else {
      res.status(403).json({
        message: `Como ${usuario.rol.nombre_rol} no tienes permiso para acceder a este recurso`
      });
    }
  } catch (error) {
    console.error('Error en authRole middleware:', error);
    res.status(500).json({
      message: "Error interno del servidor en la autorización"
    });
  }
};