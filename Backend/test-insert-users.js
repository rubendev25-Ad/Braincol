require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

// Usar service_role_key para bypass RLS (Row Level Security)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const testUsers = [
  {
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan.perez@test.com',
    telefono: '3001234567',
    fecha_nacimiento: '1990-05-15',
    genero: 'masculino',
    contraseña: 'Test123456',
    rol: 'admin'
  },
  {
    nombre: 'Pedro',
    apellido: 'López',
    correo: 'pedro.lopez@test.com',
    telefono: '3007778888',
    fecha_nacimiento: '1988-12-20',
    genero: 'masculino',
    contraseña: 'Test123456',
    rol: 'admin'
  },
  {
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    correo: 'carlos.rodriguez@test.com',
    telefono: '3005551234',
    fecha_nacimiento: '1995-03-10',
    genero: 'masculino',
    contraseña: 'Test123456',
    rol: 'admin'
  }
];

async function insertTestUsers() {
  console.log('🚀 Iniciando inserción de usuarios de prueba...\n');

  for (const user of testUsers) {
    try {
      console.log(`📝 Insertando usuario: ${user.nombre} ${user.apellido}`);
      
      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(user.contraseña, 10);
      
      // Generar código de verificación
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiry = new Date(Date.now() + 15 * 60 * 1000);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.correo.toLowerCase(),
            telefono: user.telefono,
            fecha_nacimiento: user.fecha_nacimiento,
            genero: user.genero,
            contraseña: hashedPassword,
            rol: user.rol,
            activo: true // Activado por defecto para pruebas
          }
        ])
        .select();

      if (error) {
        console.error(`❌ Error al insertar ${user.correo}:`, error.message);
        console.error('📋 Detalles:', JSON.stringify(error, null, 2));
      } else {
        console.log(`✅ Usuario insertado exitosamente: ${user.correo}`);
        console.log(`   ID: ${data[0].identificación}`);
        console.log(`   Código: ${verificationCode}\n`);
      }
    } catch (err) {
      console.error(`❌ Error crítico al insertar ${user.correo}:`, err.message);
    }
  }

  console.log('🎉 Proceso completado!');
  console.log('\n📊 Verifica los usuarios en Supabase Dashboard');
  process.exit(0);
}

insertTestUsers();