import { Router } from "express";
import { 
  getSuscripciones, 
  getSuscripcionById, 
  postSuscripcion, 
  actualizarSuscripcion, 
  eliminarSuscripcion 
} from "./suscripcion.controllers.js";

const routerSuscripcion = Router();

// CRUD routes for Suscripcion
routerSuscripcion.get('/', getSuscripciones);
routerSuscripcion.post('/', postSuscripcion);
routerSuscripcion.get('/:id', getSuscripcionById);
routerSuscripcion.put('/:id', actualizarSuscripcion);
routerSuscripcion.delete('/:id', eliminarSuscripcion);

export default routerSuscripcion; 