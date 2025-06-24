import { z } from "zod";

export const registrarClienteSchema = z.object({
  nombre_empresa: z.string().min(1, "El nombre de la empresa es requerido"),
  suscripcion_id: z.number().int().nullable().optional(),
  activo: z.boolean().default(true)
});

export const actualizarClienteSchema = z.object({
  nombre_empresa: z.string().min(1, "El nombre de la empresa es requerido").optional(),
  suscripcion_id: z.number().int().nullable().optional(),
  activo: z.boolean().optional()
}); 