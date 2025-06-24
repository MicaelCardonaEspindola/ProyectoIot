import { Router } from "express";
import routerUser from "../components/user/user.routes.js";
import authRouter from "../services/auth/auth.routes.js";
import routerSuscripcion from "../components/suscripcion/suscripcion.routes.js";
import geminiApiRouter from "../components/AI/geminiApi.routes.js";
import routerRol from "../components/rol/rol.routes.js";
import routerPermiso from "../components/permiso/permiso.routes.js";
import routerRolPermiso from "../components/rolPermiso/rolPermiso.routes.js";
import routerEdificio from "../components/edificio/edificio.routes.js";
import routerCliente from "../components/cliente/cliente.routes.js";

const router = Router(); 
router.use('/usuario', routerUser); 
router.use('/suscripcion', routerSuscripcion);
router.use('/rol', routerRol);
router.use('/permiso', routerPermiso);
router.use('/rol-permiso', routerRolPermiso);
router.use('/edificio', routerEdificio);
router.use('/cliente', routerCliente);
router.use('/auth', authRouter);
router.use('/ai-gemini',geminiApiRouter)

export default router ;


