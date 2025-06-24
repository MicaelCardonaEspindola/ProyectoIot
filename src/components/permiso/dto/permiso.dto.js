import { z } from "zod";

export const registrarPermisoSchema = z.object({
  nombre_permiso: z.string().min(1, "El nombre del permiso es requerido"),
  descripcion: z.string().optional()
});

export const actualizarPermisoSchema = z.object({
  nombre_permiso: z.string().min(1, "El nombre del permiso es requerido").optional(),
  descripcion: z.string().optional()
}); 