import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: {
        rol: {
          select: {
            nombre_rol: true,
            descripcion: true
          }
        },
        cliente: {
          select: {
            nombre_empresa: true
          }
        }
      }
    });
    return usuarios;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerUsuarioPorId = async (id) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: {
        rol: {
          select: {
            nombre_rol: true,
            descripcion: true
          }
        },
        cliente: {
          select: {
            nombre_empresa: true
          }
        }
      }
    });
    return usuario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const obtenerUsuarioPorEmail = async (email) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: {
          select: {
            nombre_rol: true,
            descripcion: true
          }
        },
        cliente: {
          select: {
            nombre_empresa: true
          }
        }
      }
    });
    return usuario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crearUsuario = async (datos) => {
  try {
    const { nombre_completo, email, password_hash, rol_id, cliente_id, activo } = datos;
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre_completo,
        email,
        password_hash,
        rol_id,
        cliente_id,
        activo
      },
      include: {
        rol: {
          select: {
            nombre_rol: true
          }
        }
      }
    });
    return nuevoUsuario;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const actualizarUsuario = async (id, datos) => {
  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: datos,
      include: {
        rol: {
          select: {
            nombre_rol: true
          }
        }
      }
    });
    return usuarioActualizado;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const existeUsuario = await obtenerUsuarioPorId(id);
    if (!existeUsuario) {
      throw new Error(`El usuario con id ${id} no existe`);
    }

    await prisma.usuario.delete({ where: { id: parseInt(id) } });
    return { message: "Usuario eliminado con éxito" };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cambiarPassword = async (id, nuevaPassword) => {
  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: parseInt(id) },
      data: { password_hash: nuevaPassword }
    });
    return usuarioActualizado;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    throw error;
  }
};

export const obtenerPasswordActual = async (id) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      select: { password_hash: true }
    });
    return usuario?.password_hash || null;
  } catch (error) {
    console.error("Error al obtener la contraseña:", error);
    throw error;
  }
};

export const validarUsuarioExiste = async (id) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } });
    return !!usuario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const validarEmailExiste = async (email) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    return !!usuario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

