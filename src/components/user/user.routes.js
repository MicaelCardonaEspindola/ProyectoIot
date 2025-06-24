import { Router } from "express";
import { 
  getUsuarios, 
  getUsuarioPorId, 
  getUsuarioPorEmail,
  postUsuario, 
  putUsuario, 
  deleteUsuario, 
  patchPassword, 
  renovarToken 
} from "./user.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";
import { authRole } from "../../middlewares/auth_role.js";
import { validateCreate } from "../../validators/user.js";

const routerUser = Router();

// CRUD routes for Usuario
routerUser.get('/', getUsuarios);
routerUser.get('/:id', [checkAuth], getUsuarioPorId);
routerUser.get('/email/:email', [checkAuth], getUsuarioPorEmail);
routerUser.post('/', postUsuario);
routerUser.put('/:id', [checkAuth], putUsuario);
routerUser.delete('/:id', [checkAuth], deleteUsuario);

// Password management
routerUser.patch('/password', [checkAuth], patchPassword);

// Token management
routerUser.get('/renew', [checkAuth], renovarToken);

export default routerUser; 