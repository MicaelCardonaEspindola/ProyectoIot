import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerEdificiosModel = async () => {
  try {
    return await prisma.edificio.findMany({
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

export const getEdificioByIdModel = async (id) => {
  try {
    return await prisma.edificio.findUnique({
      where: { id: parseInt(id) },
      include: {
        cliente: {
          select: {
            id: true,
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

export const getEdificiosByClienteModel = async (clienteId) => {
  try {
    return await prisma.edificio.findMany({
      where: { cliente_id: parseInt(clienteId) },
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

export const crearEdificioModel = async (datos) => {
  try {
    const { nombre, direccion, cliente_id } = datos;
    return await prisma.edificio.create({
      data: {
        nombre,
        direccion,
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

export const actualizarEdificioModel = async (id, datos) => {
  try {
    return await prisma.edificio.update({
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

export const eliminarEdificioModel = async (id) => {
  try {
    await prisma.edificio.delete({ where: { id: parseInt(id) } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 