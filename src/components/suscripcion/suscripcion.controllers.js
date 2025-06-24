import { registrarSuscripcionSchema, actualizarSuscripcionSchema } from "./dto/suscripcion.dto.js";
import {
  obtenerSuscripcionesModel,
  getSuscripcionByIdModel,
  crearSuscripcionModel,
  actualizarSuscripcionModel,
  eliminarSuscripcionModel,
} from "./suscripcion.models.js";

export const getSuscripciones = async (req, res) => {
  try {
    const response = await obtenerSuscripcionesModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener suscripciones" });
  }
};

export const getSuscripcionById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getSuscripcionByIdModel(parseInt(id));
    if (!response) {
      return res.status(404).json({ error: "Suscripción no encontrada" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener la suscripción" });
  }
};

export const postSuscripcion = async (req, res) => {
  try {
    const datos = registrarSuscripcionSchema.parse(req.body);
    const nuevaSuscripcion = await crearSuscripcionModel(datos);
    res.status(201).json({ 
      message: "Suscripción registrada con éxito!", 
      suscripcion: nuevaSuscripcion 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear la suscripción" });
  }
};

export const actualizarSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarSuscripcionSchema.parse(req.body);
    
    const suscripcionActualizada = await actualizarSuscripcionModel(parseInt(id), datos);
    res.status(200).json({ 
      message: "Suscripción actualizada con éxito!", 
      suscripcion: suscripcionActualizada 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al actualizar la suscripción" });
  }
};

export const eliminarSuscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarSuscripcionModel(parseInt(id));
    res.status(200).json({ message: "Suscripción eliminada con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar la suscripción" });
  }
}; 