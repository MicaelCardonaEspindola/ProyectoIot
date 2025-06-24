import { registrarRolSchema, actualizarRolSchema } from "./dto/rol.dto.js";
import {
  obtenerRolesModel,
  getRolByIdModel,
  getRolesByClienteModel,
  crearRolModel,
  actualizarRolModel,
  eliminarRolModel,
} from "./rol.models.js";

export const getRoles = async (req, res) => {
  try {
    const response = await obtenerRolesModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener roles" });
  }
};

export const getRolById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getRolByIdModel(id);
    if (!response) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el rol" });
  }
};

export const getRolesByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const response = await getRolesByClienteModel(clienteId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener roles del cliente" });
  }
};

export const postRol = async (req, res) => {
  try {
    const datos = registrarRolSchema.parse(req.body);
    const nuevoRol = await crearRolModel(datos);
    res.status(201).json({ 
      message: "Rol registrado con éxito!", 
      rol: nuevoRol 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el rol" });
  }
};

export const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarRolSchema.parse(req.body);
    
    const rolActualizado = await actualizarRolModel(id, datos);
    res.status(200).json({ 
      message: "Rol actualizado con éxito!", 
      rol: rolActualizado 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el rol" });
  }
};

export const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarRolModel(id);
    res.status(200).json({ message: "Rol eliminado con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el rol" });
  }
}; 