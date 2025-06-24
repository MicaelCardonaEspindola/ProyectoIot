import { registrarPermisoSchema, actualizarPermisoSchema } from "./dto/permiso.dto.js";
import {
  obtenerPermisosModel,
  getPermisoByIdModel,
  crearPermisoModel,
  actualizarPermisoModel,
  eliminarPermisoModel,
} from "./permiso.models.js";

export const getPermisos = async (req, res) => {
  try {
    const response = await obtenerPermisosModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener permisos" });
  }
};

export const getPermisoById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getPermisoByIdModel(id);
    if (!response) {
      return res.status(404).json({ error: "Permiso no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el permiso" });
  }
};

export const postPermiso = async (req, res) => {
  try {
    const datos = registrarPermisoSchema.parse(req.body);
    const nuevoPermiso = await crearPermisoModel(datos);
    res.status(201).json({ 
      message: "Permiso registrado con éxito!", 
      permiso: nuevoPermiso 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el permiso" });
  }
};

export const actualizarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarPermisoSchema.parse(req.body);
    
    const permisoActualizado = await actualizarPermisoModel(id, datos);
    res.status(200).json({ 
      message: "Permiso actualizado con éxito!", 
      permiso: permisoActualizado 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el permiso" });
  }
};

export const eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarPermisoModel(id);
    res.status(200).json({ message: "Permiso eliminado con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el permiso" });
  }
}; 