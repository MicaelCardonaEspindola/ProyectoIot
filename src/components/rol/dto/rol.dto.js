import { z } from "zod";

export const registrarRolSchema = z.object({
  nombre_rol: z.string().min(1, "El nombre del rol es requerido"),
  descripcion: z.string().optional(),
  cliente_id: z.number().int().nullable()
});

export const actualizarRolSchema = z.object({
  nombre_rol: z.string().min(1, "El nombre del rol es requerido").optional(),
  descripcion: z.string().optional(),
  cliente_id: z.number().int().positive("El ID del cliente es requerido").optional()
}); 