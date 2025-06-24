import { Router } from "express";
import { 
  getClientes, 
  getClienteById, 
  postCliente, 
  actualizarCliente, 
  eliminarCliente,
  comprarSuscripcion,
  confirmarPagoSuscripcion,
  obtenerPreciosSuscripciones
} from "./cliente.controllers.js";
import { checkAuth } from "../../middlewares/auth.js";
import { validarCompraSuscripcion, validarConfirmacionPago } from "./dto/pago.dto.js";

const routerCliente = Router();

// CRUD routes for Cliente
routerCliente.get('/', getClientes);
routerCliente.post('/', postCliente);
routerCliente.get('/:id', getClienteById);
routerCliente.put('/:id', actualizarCliente);
routerCliente.delete('/:id', eliminarCliente);

// Rutas de pago con Stripe
routerCliente.post('/comprar-suscripcion', [ validarCompraSuscripcion], comprarSuscripcion);
routerCliente.post('/confirmar-pago', [ validarConfirmacionPago], confirmarPagoSuscripcion);
routerCliente.get('/precios/suscripciones', obtenerPreciosSuscripciones);

export default routerCliente; 