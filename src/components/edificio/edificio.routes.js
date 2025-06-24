import { Router } from "express";
import { 
  getEdificios, 
  getEdificioById, 
  getEdificiosByCliente,
  postEdificio, 
  actualizarEdificio, 
  eliminarEdificio 
} from "./edificio.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";

const routerEdificio = Router();

// CRUD routes for Edificio
routerEdificio.get('/', [checkAuth], getEdificios);
routerEdificio.post('/', [checkAuth], postEdificio);
routerEdificio.get('/:id', [checkAuth], getEdificioById);
routerEdificio.put('/:id', [checkAuth], actualizarEdificio);
routerEdificio.delete('/:id', [checkAuth], eliminarEdificio);

// Additional routes
routerEdificio.get('/cliente/:clienteId', [checkAuth], getEdificiosByCliente);

export default routerEdificio; 