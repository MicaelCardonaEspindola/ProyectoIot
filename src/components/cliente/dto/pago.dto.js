import { z } from "zod";

export const comprarSuscripcionSchema = z.object({
  cliente_id: z.number().min(1, "El ID de cliente es requerido"),
  suscripcion_id: z.number().min(1, "El ID de suscripción es requerido"),
  metodo_pago: z.string().optional()
});

export const confirmarPagoSchema = z.object({
  payment_intent_id: z.string().min(1, "El ID del payment intent es requerido")
});

export const validarCompraSuscripcion = (req, res, next) => {
  try {
    const { error } = comprarSuscripcionSchema.safeParse(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Datos de entrada inválidos',
        details: error.errors 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error en validación' });
  }
};

export const validarConfirmacionPago = (req, res, next) => {
  try {
    const { error } = confirmarPagoSchema.safeParse(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Datos de entrada inválidos',
        details: error.errors 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error en validación' });
  }
}; 