import { registrarClienteSchema, actualizarClienteSchema } from "./dto/cliente.dto.js";
import {
  obtenerClientesModel,
  getClienteByIdModel,
  crearClienteModel,
  actualizarClienteModel,
  eliminarClienteModel,
} from "./cliente.models.js";
import { getSuscripcionByIdModel, obtenerSuscripcionesModel } from "../suscripcion/suscripcion.models.js";
import Stripe from 'stripe';

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getClientes = async (req, res) => {
  try {
    const response = await obtenerClientesModel();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getClienteByIdModel(id);
    if (!response) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
};

export const postCliente = async (req, res) => {
  try {
    const datos = registrarClienteSchema.parse(req.body);
    const nuevoCliente = await crearClienteModel(datos);
    res.status(201).json({ 
      message: "Cliente registrado con éxito!", 
      cliente: nuevoCliente 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = actualizarClienteSchema.parse(req.body);
    
    const clienteActualizado = await actualizarClienteModel(id, datos);
    res.status(200).json({ 
      message: "Cliente actualizado con éxito!", 
      cliente: clienteActualizado 
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: "Datos inválidos", detalles: error.errors });
    }
    console.log(error);
    res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarClienteModel(id);
    res.status(200).json({ message: "Cliente eliminado con éxito!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};

export const comprarSuscripcion = async (req, res) => {
  try {
    const { cliente_id, suscripcion_id } = req.body;

    // Validar cliente
    const cliente = await getClienteByIdModel(cliente_id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Validar suscripción
    const suscripcion = await getSuscripcionByIdModel(suscripcion_id);
    if (!suscripcion) {
      return res.status(404).json({ error: 'Suscripción no encontrada' });
    }

    const montoEnCentavos = Math.round(suscripcion.precio * 100);

    // Verifica que DOMAIN tenga protocolo (https:// o http://localhost:3000)
    if (!process.env.DOMAIN?.startsWith('http')) {
      return res.status(500).json({ error: 'La variable DOMAIN debe comenzar con http:// o https:// para que Stripe funcione' });
    }

    // Crear sesión de Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: suscripcion.nombre_plan,
              description: suscripcion.descripcion || '',
            },
            unit_amount: montoEnCentavos,
          },
          quantity: 1,
        },
      ],
      metadata: {
        cliente_id: cliente_id.toString(),
        suscripcion_id: suscripcion_id.toString(),
      },
     success_url: `${process.env.DOMAIN}/register`,
  cancel_url: `${process.env.DOMAIN}/login`,
    });

    // Respuesta: solo necesitas redireccionar a esta URL en el frontend
    res.json({
      success: true,
      session_id: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error);
    res.status(500).json({ error: 'Error interno al crear la sesión de pago' });
  }
};

export const confirmarPagoSuscripcion = async (req, res) => {
  try {
    const { payment_intent_id } = req.body;

    // Obtener el payment intent de Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
//console.log(paymentIntent)
    if (paymentIntent.status) {
      // Extraer datos del metadata
      const cliente_id = parseInt(paymentIntent.metadata.cliente_id);
      const suscripcion_id = parseInt(paymentIntent.metadata.suscripcion_id);
  
        console.log(cliente_id)
      // Actualizar la suscripción del cliente
      await actualizarClienteModel(cliente_id, {
        suscripcion_id: suscripcion_id,
        activo: true
      }); 

      res.json({
        success: true,
        message: 'Pago confirmado y suscripción activada exitosamente',
        cliente_id: cliente_id,
        suscripcion_id: suscripcion_id,
        plan: paymentIntent.metadata.nombre_plan
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'El pago no pudo ser procesado'
      }); 
    }

  } catch (error) {
    console.error('Error al confirmar pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const obtenerPreciosSuscripciones = async (req, res) => {
  try {
    const suscripciones = await obtenerSuscripcionesModel();
    
    const precios = suscripciones.map(suscripcion => ({
      id: suscripcion.id,
      nombre_plan: suscripcion.nombre_plan,
      precio: suscripcion.precio,
      limite_edificios: suscripcion.limite_edificios,
      limite_usuarios: suscripcion.limite_usuarios,
      descripcion: suscripcion.descripcion
    }));

    res.json({
      success: true,
      suscripciones: precios
    });

  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}; 