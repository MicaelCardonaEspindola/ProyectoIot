import { z } from "zod";

export const registrarSuscripcionSchema = z.object({
  nombre_plan: z.string().min(1, "El nombre del plan es requerido"),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  limite_edificios: z.number().optional(),
  limite_usuarios: z.number().optional(),
  descripcion: z.string().optional()
});

export const actualizarSuscripcionSchema = z.object({
  nombre_plan: z.string().min(1, "El nombre del plan es requerido").optional(),
  precio: z.number().min(0, "El precio debe ser mayor o igual a 0").optional(),
  limite_edificios: z.number().optional(),
  limite_usuarios: z.number().optional(),
  descripcion: z.string().optional()
}); 