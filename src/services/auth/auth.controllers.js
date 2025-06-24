import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import { obtenerUsuarioPorEmail } from "../../components/user/user.models.js";

export const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY_TOKEN);
  } catch (error) {
    return null;
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.toLowerCase().trim();
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email y contraseña son requeridos", 
        success: false 
      });
    }

    const usuario = await obtenerUsuarioPorEmail(email);
    
    if (!usuario) {
      return res.status(401).json({ 
        message: "Usuario no encontrado", 
        success: false 
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        message: "Usuario inactivo", 
        success: false 
      });
    }

    const checkPassword = await bcrypt.compare(password, usuario.password_hash);
 
    if (!checkPassword) {
      return res.status(401).json({ 
        message: "Contraseña incorrecta", 
        success: false 
      }); 
    } 

    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email, 
        nombre_rol: usuario.rol.nombre_rol,
        nombre_completo: usuario.nombre_completo,
        cliente_id: usuario.cliente_id
      },
      process.env.SECRET_KEY_TOKEN, 
      {
        expiresIn: "24h",
      }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso", 
      token,
      success: true, 
      data: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol.nombre_rol,
        cliente_id: usuario.cliente_id,
        activo: usuario.activo
      } 
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ 
      message: "Error interno del servidor", 
      success: false 
    }); 
  }
};
  