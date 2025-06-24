import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerClientesModel = async () => {
  try {
    return await prisma.cliente.findMany({
      include: {
        suscripcion: {
          select: {
            nombre_plan: true,
            descripcion: true
          }
        },
        _count: {
          select: {
            edificios: true,
            usuarios: true,
            roles: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error); 
    throw error;
  }
};

export const getClienteByIdModel = async (id) => {
  try {
    return await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
      include: {
        suscripcion: {
          select: {
            nombre_plan: true,
            descripcion: true
          }
        },
        edificios: true,
        usuarios: {
          select: {
            id: true,
            nombre_completo: true,
            email: true,
            activo: true
          }
        },
        roles: {
          select: {
            id: true,
            nombre_rol: true,
            descripcion: true
          }
        },
        _count: {
          select: {
            edificios: true,
            usuarios: true,
            roles: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crearClienteModel = async (datos) => {
  try {
    const { nombre_empresa, suscripcion_id, activo } = datos;
    return await prisma.cliente.create({
      data: {
        nombre_empresa,
        suscripcion_id,
        activo
      },
      include: {
        suscripcion: {
          select: {
            nombre_plan: true
          }
        }
      }
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const actualizarClienteModel = async (id, datos) => {
  try {
    return await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: datos,
      include: {
        suscripcion: {
          select: {
            nombre_plan: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarClienteModel = async (id) => {
  try {
    await prisma.cliente.delete({ where: { id: parseInt(id) } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 