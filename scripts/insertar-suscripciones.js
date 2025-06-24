import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

const suscripciones = [
  {
    nombre_plan: 'Básico',
    precio: 29.00,
    limite_edificios: 5,
    limite_usuarios: 10,
    descripcion: 'Plan básico para pequeñas empresas'
  },
  {
    nombre_plan: 'Profesional',
    precio: 59.00,
    limite_edificios: 20,
    limite_usuarios: 50,
    descripcion: 'Plan profesional para empresas medianas'
  },
  {
    nombre_plan: 'Empresarial',
    precio: 99.00,
    limite_edificios: 100,
    limite_usuarios: 200,
    descripcion: 'Plan empresarial para grandes organizaciones'
  }
];

async function insertarSuscripciones() {
  try {
    console.log('Insertando suscripciones...');
    
    for (const suscripcion of suscripciones) {
      const existe = await prisma.suscripcion.findFirst({
        where: { nombre_plan: suscripcion.nombre_plan }
      });
      
      if (!existe) {
        await prisma.suscripcion.create({
          data: suscripcion
        });
        console.log(`Suscripción "${suscripcion.nombre_plan}" creada con precio $${suscripcion.precio}`);
      } else {
        console.log(`Suscripción "${suscripcion.nombre_plan}" ya existe`);
      }
    }
    
    console.log('Proceso completado');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

//insertarSuscripciones(); 