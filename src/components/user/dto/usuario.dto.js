import { z } from "zod";

export const registrarUsuarioSchema = z.object({
  nombre_completo: z.string().min(1, "El nombre completo es requerido"),
  email: z.string().email("Email no válido"),
  password_hash: z.string().min(6, "La contraseña debe tener mínimo 6 caracteres"),
  rol_id: z.number().int().positive("El ID del rol es requerido"),
  cliente_id: z.number().int().positive().optional().nullable(),
  activo: z.boolean().default(true)
});

export const actualizarUsuarioSchema = z.object({
  nombre_completo: z.string().min(1, "El nombre completo es requerido").optional(),
  email: z.string().email("Email no válido").optional(),
  rol_id: z.number().int().positive("El ID del rol es requerido").optional(),
  cliente_id: z.number().int().positive().optional(),
  activo: z.boolean().optional()
});

export const cambiarPasswordSchema = z.object({
  id: z.number().int().positive("El ID del usuario es requerido"),
  password_actual: z.string().min(1, "La contraseña actual es requerida"),
  password_nueva: z.string().min(6, "La nueva contraseña debe tener mínimo 6 caracteres")
}); 