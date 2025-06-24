import { Router } from "express";
import { 
  getPermisos, 
  getPermisoById, 
  postPermiso, 
  actualizarPermiso, 
  eliminarPermiso 
} from "./permiso.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";

const routerPermiso = Router();

// CRUD routes for Permiso
routerPermiso.get('/', [checkAuth], getPermisos);
routerPermiso.post('/', [checkAuth], postPermiso);
routerPermiso.get('/:id', [checkAuth], getPermisoById);
routerPermiso.put('/:id', [checkAuth], actualizarPermiso);
routerPermiso.delete('/:id', [checkAuth], eliminarPermiso);

export default routerPermiso; 