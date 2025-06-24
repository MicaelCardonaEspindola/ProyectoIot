import { check } from "express-validator";
import { validateResult } from "../helpers/validateHelper.js";
import { validarEmailExiste } from "../components/user/user.models.js";

export const validateCreate = [
  check('nombre_completo')
    .exists()
    .not()
    .isEmpty()
    .withMessage("El nombre completo es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

  check('email')
    .exists()
    .isEmail()
    .withMessage("Email no válido")
    .custom(async (value) => {
      const emailExiste = await validarEmailExiste(value);
      if (emailExiste) {
        return Promise.reject('El email ya está registrado');
      }
    }),

  check('password_hash')
    .exists()
    .not()
    .isEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  check('rol_id')
    .exists()
    .isInt({ min: 1 })
    .withMessage("El ID del rol es requerido y debe ser un número válido"),

  check('cliente_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID del cliente debe ser un número válido"),

  check('activo')
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser un valor booleano"),

  (req, res, next) => {
    validateResult(req, res, next);
  }
];
