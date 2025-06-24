import { verifyToken } from "../services/auth/auth.controllers.js"



 export const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ 
        error: "Token de autorización requerido" 
      });
    }
    
    const token = req.headers.authorization.split(' ').pop();
    const tokenData = await verifyToken(token);
    
    if (!tokenData) {
      return res.status(401).json({ 
        error: "Token inválido o expirado" 
      });
    }
    
    if (tokenData.email) {
      req.user = tokenData; // Add user data to request
      next();
    } else {
      res.status(403).json({ 
        error: "Acceso restringido para este usuario" 
      });
    }

  } catch (error) {
    console.error('Error en checkAuth middleware:', error);
    res.status(403).json({ 
      error: "Usuario no autorizado" 
    });
  }
}

