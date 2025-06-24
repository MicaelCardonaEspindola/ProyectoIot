import { registrarEdificioSchema, actualizarEdificioSchema } from "./dto/edificio.dto.js";
import {
  obtenerEdificiosModel,
  getEdificioByIdModel,
  getEdificiosByClienteModel,
  crearEdificioModel,
  actualizarEdificioModel,
  eliminarEdificioModel,
} from "./edificio.models.js";

export const getEdificios = async (req, res) => {
  try {
    const response = await obtenerEdificiosModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener edificios" });
  }
};

export const getEdificioById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getEdificioByIdModel(id);
    if (!response) {
      return res.status(404).json({ error: "Edificio no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el edificio" });
  }
};

export const getEdificiosByCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const response = await getEdificiosByClienteModel(clienteId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener edificios del cliente" });
  }
};

export const postEdificio = async (req, res) => {
  try {
    const datos = registrarEdificioSchema.parse(req.body);
    const nuevoEdificio = await crearEdificioModel(datos);
    res.status(201).json({ 
      message: "Edificio registrado con éxito!", 
      edificio: nuevoEdificio 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el edificio" });
  }
};

export const actualizarEdificio = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarEdificioSchema.parse(req.body);
    
    const edificioActualizado = await actualizarEdificioModel(id, datos);
    res.status(200).json({ 
      message: "Edificio actualizado con éxito!", 
      edificio: edificioActualizado 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el edificio" });
  }
};

export const eliminarEdificio = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarEdificioModel(id);
    res.status(200).json({ message: "Edificio eliminado con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el edificio" });
  }
}; 