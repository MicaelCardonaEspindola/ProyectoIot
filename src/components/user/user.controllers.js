import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword,
  obtenerPasswordActual,
  validarUsuarioExiste,
  validarEmailExiste
} from "./user.models.js";
import bcrypt from "bcrypt";
import { 
  registrarUsuarioSchema, 
  actualizarUsuarioSchema, 
  cambiarPasswordSchema 
} from "./dto/usuario.dto.js";

export const getUsuarios = async (req, res) => {
  try {
    const response = await obtenerUsuarios();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

export const getUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await obtenerUsuarioPorId(id);
    if (!response) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const getUsuarioPorEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const response = await obtenerUsuarioPorEmail(email);
    if (!response) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const postUsuario = async (req, res) => {
  try {
    const datos = registrarUsuarioSchema.parse(req.body);
    
    // Verificar si el email ya existe
    const emailExiste = await validarEmailExiste(datos.email);
    if (emailExiste) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // Encriptar contraseña
    const passwordHash = await encryptarPassword(datos.password_hash);
    datos.password_hash = passwordHash;

    const nuevoUsuario = await crearUsuario(datos);

    res.status(201).json({
      message: 'Usuario registrado con éxito!',
      usuario: nuevoUsuario
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
};

export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarUsuarioSchema.parse(req.body);

    // Verificar si el usuario existe
    const usuarioExiste = await validarUsuarioExiste(id);
    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si se está actualizando el email, verificar que no exista
    if (datos.email) {
      const emailExiste = await validarEmailExiste(datos.email);
      if (emailExiste) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
    }

    const usuarioActualizado = await actualizarUsuario(id, datos);

    res.status(200).json({
      message: 'Usuario actualizado con éxito!',
      usuario: usuarioActualizado
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await eliminarUsuario(id);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

export const patchPassword = async (req, res) => {
  try {
    const datos = cambiarPasswordSchema.parse(req.body);
    const { id, password_actual, password_nueva } = datos;

    // Verificar si el usuario existe
    if (!(await validarUsuarioExiste(id))) {
      return res.status(404).json({ error: `El usuario con id ${id} no existe` });
    }

    // Verificar contraseña actual
    const passwordActual = await obtenerPasswordActual(id);
    const match = await bcrypt.compare(password_actual, passwordActual);
    
    if (match) {
      const nuevaPasswordHash = await encryptarPassword(password_nueva);
      await cambiarPassword(id, nuevaPasswordHash);
      res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } else {
      res.status(403).json({ error: "La contraseña actual no es correcta" });
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al cambiar la contraseña" });
  }
};

const encryptarPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const renovarToken = async (req, res) => {
  return res.status(200).json({ message: "Token renovado con éxito!" });
};

