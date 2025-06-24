import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerPermisosModel = async () => {
  try {
    return await prisma.permiso.findMany({
      include: {
        _count: {
          select: {
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

export const getPermisoByIdModel = async (id) => {
  try {
    return await prisma.permiso.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          include: {
            rol: {
              select: {
                nombre_rol: true,
                cliente: {
                  select: {
                    nombre_empresa: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
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

export const crearPermisoModel = async (datos) => {
  try {
    const { nombre_permiso, descripcion } = datos;
    return await prisma.permiso.create({
      data: {
        nombre_permiso,
        descripcion
      }
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const actualizarPermisoModel = async (id, datos) => {
  try {
    return await prisma.permiso.update({
      where: { id: parseInt(id) },
      data: datos
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarPermisoModel = async (id) => {
  try {
    await prisma.permiso.delete({ where: { id: parseInt(id) } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 