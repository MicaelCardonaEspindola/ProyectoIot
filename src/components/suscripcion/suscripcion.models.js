import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerSuscripcionesModel = async () => {
  try {
    return await prisma.suscripcion.findMany();
  } catch (error) {
    console.error(error); 
    throw error;
  }
};

export const getSuscripcionByIdModel = async (id) => {
  try {
    return await prisma.suscripcion.findUnique({ where: { id } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const crearSuscripcionModel = async (datos) => {
  try {
    const {nombre_plan, precio, limite_edificios, limite_usuarios, descripcion} = datos;
    return await prisma.suscripcion.create({
      data: {
        nombre_plan,
        precio,
        limite_edificios,
        limite_usuarios,
        descripcion
      }
    });
  } catch (error) { 
    console.error(error);
    throw error;
  }
};

export const actualizarSuscripcionModel = async (id, datos) => {
  try {
    return await prisma.suscripcion.update({
      where: { id },
      data: datos
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const eliminarSuscripcionModel = async (id) => {
  try {
    await prisma.suscripcion.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw error;
  }
}; 