import { z } from "zod";

export const asignarPermisoSchema = z.object({
  rol_id: z.number().int().positive("El ID del rol es requerido"),
  permiso_id: z.number().int().positive("El ID del permiso es requerido")
});

export const asignarPermisosSchema = z.object({
  rol_id: z.number().int().positive("El ID del rol es requerido"),
  permisos_ids: z.array(z.number().int().positive("Cada ID de permiso debe ser un número válido"))
}); 