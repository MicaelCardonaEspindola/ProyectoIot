import { Router } from "express";
import { 
  getRoles, 
  getRolById, 
  getRolesByCliente,
  postRol, 
  actualizarRol, 
  eliminarRol 
} from "./rol.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";

const routerRol = Router();

// CRUD routes for Rol
routerRol.get('/', getRoles);
routerRol.post('/', postRol);
routerRol.get('/:id', [checkAuth], getRolById);
routerRol.put('/:id', [checkAuth], actualizarRol);
routerRol.delete('/:id', [checkAuth], eliminarRol);

// Additional routes
routerRol.get('/cliente/:clienteId', [checkAuth], getRolesByCliente);

export default routerRol; 