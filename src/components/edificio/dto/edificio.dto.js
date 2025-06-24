import { z } from "zod";

export const registrarEdificioSchema = z.object({
  nombre: z.string().min(1, "El nombre del edificio es requerido"),
  direccion: z.string().optional(),
  cliente_id: z.number().int().positive("El ID del cliente es requerido")
});

export const actualizarEdificioSchema = z.object({
  nombre: z.string().min(1, "El nombre del edificio es requerido").optional(),
  direccion: z.string().optional(),
  cliente_id: z.number().int().positive("El ID del cliente es requerido").optional()
}); 