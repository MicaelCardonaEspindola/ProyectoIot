import { asignarPermisoSchema, asignarPermisosSchema } from "./dto/rolPermiso.dto.js";
import {
  obtenerPermisosDeRolModel,
  obtenerRolesDePermisoModel,
  asignarPermisoARolModel,
  asignarPermisosARolModel,
  removerPermisoDeRolModel,
  removerTodosPermisosDeRolModel,
  verificarPermisoEnRolModel,
} from "./rolPermiso.models.js";

export const getPermisosDeRol = async (req, res) => {
  try {
    const { rolId } = req.params;
    const response = await obtenerPermisosDeRolModel(rolId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener permisos del rol" });
  }
};

export const getRolesDePermiso = async (req, res) => {
  try {
    const { permisoId } = req.params;
    const response = await obtenerRolesDePermisoModel(permisoId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener roles del permiso" });
  }
};

export const postAsignarPermiso = async (req, res) => {
  try {
    const datos = asignarPermisoSchema.parse(req.body);
    const { rol_id, permiso_id } = datos;
    
    // Verificar si ya existe la relación
    const existe = await verificarPermisoEnRolModel(rol_id, permiso_id);
    if (existe) {
      return res.status(400).json({ error: "El permiso ya está asignado a este rol" });
    }
    
    const nuevaAsignacion = await asignarPermisoARolModel(rol_id, permiso_id);
    res.status(201).json({ 
      message: "Permiso asignado al rol con éxito!", 
      asignacion: nuevaAsignacion 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al asignar permiso al rol" });
  }
};

export const postAsignarPermisos = async (req, res) => {
  try {
    const datos = asignarPermisosSchema.parse(req.body);
    const { rol_id, permisos_ids } = datos;
    
    const resultado = await asignarPermisosARolModel(rol_id, permisos_ids);
    res.status(201).json({ 
      message: "Permisos asignados al rol con éxito!", 
      asignaciones: resultado.count 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al asignar permisos al rol" });
  }
};

export const deleteRemoverPermiso = async (req, res) => {
  try {
    const { rolId, permisoId } = req.params;
    await removerPermisoDeRolModel(rolId, permisoId);
    res.status(200).json({ message: "Permiso removido del rol con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al remover permiso del rol" });
  }
};

export const deleteRemoverTodosPermisos = async (req, res) => {
  try {
    const { rolId } = req.params;
    await removerTodosPermisosDeRolModel(rolId);
    res.status(200).json({ message: "Todos los permisos removidos del rol con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al remover permisos del rol" });
  }
};

export const getVerificarPermiso = async (req, res) => {
  try {
    const { rolId, permisoId } = req.params;
    const tienePermiso = await verificarPermisoEnRolModel(rolId, permisoId);
    res.status(200).json({ 
      tiene_permiso: tienePermiso 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al verificar permiso" });
  }
}; 