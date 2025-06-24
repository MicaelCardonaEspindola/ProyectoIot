import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerPermisosDeRolModel = async (rolId) => {
  try {
    return await prisma.rolPermiso.findMany({
      where: { rol_id: parseInt(rolId) },
      include: {
        permiso: {
          select: {
            id: true,
            nombre_permiso: true,
            descripcion: true
          }
        }
      }
    });
  } catch (error) {
    console.error(error); 
    throw error;
  }
};

export const obtenerRolesDePermisoModel = async (permisoId) => {
  try {
    return await prisma.rolPermiso.findMany({
      where: { permiso_id: parseInt(permisoId) },
      include: {
        rol: {
          select: {
            id: true,
            nombre_rol: true,
            descripcion: true,
            cliente: {
              select: {
                nombre_empresa: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const asignarPermisoARolModel = async (rolId, permisoId) => {
  try {
    return await prisma.rolPermiso.create({
      data: {
        rol_id: parseInt(rolId),
        permiso_id: parseInt(permisoId)
      },
      include: {
        rol: {
          select: {
            nombre_rol: true
          }
        },
        permiso: {
          select: {
            nombre_permiso: true
          }
        }
      }
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const asignarPermisosARolModel = async (rolId, permisosIds) => {
  try {
    const data = permisosIds.map(permisoId => ({
      rol_id: parseInt(rolId),
      permiso_id: parseInt(permisoId)
    }));

    return await prisma.rolPermiso.createMany({
      data,
      skipDuplicates: true
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const removerPermisoDeRolModel = async (rolId, permisoId) => {
  try {
    await prisma.rolPermiso.delete({
      where: {
        rol_id_permiso_id: {
          rol_id: parseInt(rolId),
          permiso_id: parseInt(permisoId)
        }
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removerTodosPermisosDeRolModel = async (rolId) => {
  try {
    await prisma.rolPermiso.deleteMany({
      where: { rol_id: parseInt(rolId) }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verificarPermisoEnRolModel = async (rolId, permisoId) => {
  try {
    const rolPermiso = await prisma.rolPermiso.findUnique({
      where: {
        rol_id_permiso_id: {
          rol_id: parseInt(rolId),
          permiso_id: parseInt(permisoId)
        }
      }
    });
    return !!rolPermiso;
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 