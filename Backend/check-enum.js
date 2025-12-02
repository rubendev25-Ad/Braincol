require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkEnums() {
  console.log('🔍 Verificando valores de enum del rol...\n');

  // Ver los roles existentes en los usuarios actuales
  const { data, error } = await supabase
    .from('users')
    .select('rol')
    .limit(10);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    const roles = [...new Set(data.map(u => u.rol))];
    console.log('✅ Roles encontrados en la tabla:', roles);
  }

  // Intentar insertar con diferentes roles para ver cuál funciona
  console.log('\n🧪 Probando diferentes valores de rol...');
  
  const testRoles = ['familia', 'cuidador', 'admin', 'paciente', 'usuario'];
  
  for (const rol of testRoles) {
    const testEmail = `test-${rol}-${Date.now()}@test.com`;
    const { data, error } = await supabase
      .from('users')
      .insert([{
        nombre: 'Test',
        apellido: 'Test',
        correo: testEmail,
        contraseña: 'test123',
        rol: rol,
        activo: false
      }])
      .select();

    if (error) {
      console.log(`❌ "${rol}": ${error.message}`);
    } else {
      console.log(`✅ "${rol}": válido`);
      // Eliminar el registro de prueba
      await supabase.from('users').delete().eq('correo', testEmail);
    }
  }

  process.exit(0);
}

checkEnums();
