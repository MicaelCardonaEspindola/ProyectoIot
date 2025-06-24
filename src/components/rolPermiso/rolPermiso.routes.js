import { Router } from "express";
import { 
  getPermisosDeRol,
  getRolesDePermiso,
  postAsignarPermiso,
  postAsignarPermisos,
  deleteRemoverPermiso,
  deleteRemoverTodosPermisos,
  getVerificarPermiso
} from "./rolPermiso.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";

const routerRolPermiso = Router();

// Relationship management routes for RolPermiso
routerRolPermiso.get('/rol/:rolId/permisos', [checkAuth], getPermisosDeRol);
routerRolPermiso.get('/permiso/:permisoId/roles', [checkAuth], getRolesDePermiso);
routerRolPermiso.post('/asignar', [checkAuth], postAsignarPermiso);
routerRolPermiso.post('/asignar-multiple', [checkAuth], postAsignarPermisos);
routerRolPermiso.delete('/rol/:rolId/permiso/:permisoId', [checkAuth], deleteRemoverPermiso);
routerRolPermiso.delete('/rol/:rolId/permisos', [checkAuth], deleteRemoverTodosPermisos);
routerRolPermiso.get('/verificar/:rolId/:permisoId', [checkAuth], getVerificarPermiso);

export default routerRolPermiso; 