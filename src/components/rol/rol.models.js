import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerRolesModel = async () => {
  try {
    return await prisma.rol.findMany({
      include: {
        cliente: {
          select: {
            nombre_empresa: true
          }
        },
        _count: {
          select: {
            usuarios: true,
            permisos: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error); 
    throw error;
  }
};

export const getRolByIdModel = async (id) => {
  try {
    return await prisma.rol.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: {
          select: {
            nombre_empresa: true
          }
        },
        usuarios: {
          select: {
            id: true,
            nombre_completo: true,
            email: true,
            activo: true
          }
        },
        permisos: {
          include: {
            permiso: {
              select: {
                nombre_permiso: true,
                descripcion: true
              }
            }
          }
        },
        _count: {
          select: {
            usuarios: true,
            permisos: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getRolesByClienteModel = async (clienteId) => {
  try {
    return await prisma.rol.findMany({
      where: { cliente_id: parseInt(clienteId) },
      include: {
        cliente: {
          select: {
            nombre_empresa: true
          }
        },
        _count: {
          select: {
            usuarios: true,
            permisos: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crearRolModel = async (datos) => {
  try {
    const { nombre_rol, descripcion, cliente_id } = datos;
    return await prisma.rol.create({
      data: {
        nombre_rol,
        descripcion,
        cliente_id
      },
      include: {
        cliente: {
          select: {
            nombre_empresa: true
          }
        }
      }
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const actualizarRolModel = async (id, datos) => {
  try {
    return await prisma.rol.update({
      where: { id: parseInt(id) },
      data: datos,
      include: {
        cliente: {
          select: {
            nombre_empresa: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarRolModel = async (id) => {
  try {
    await prisma.rol.delete({ where: { id: parseInt(id) } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 