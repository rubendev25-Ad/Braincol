require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkSchema() {
  console.log('🔍 Verificando estructura de la tabla users...\n');

  // Intentar obtener un registro de ejemplo (o error que mostrará columnas esperadas)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    if (data && data.length > 0) {
      console.log('✅ Columnas encontradas:');
      console.log(Object.keys(data[0]).join(', '));
      console.log('\n📊 Ejemplo de datos:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️  La tabla está vacía. Intentando insertar un registro de prueba...');
      
      // Intentar con las columnas en español actuales
      const testInsert = await supabase
        .from('users')
        .insert([{
          nombre: 'Test',
          correo: 'test@example.com',
          contraseña: 'test123'
        }])
        .select();

      console.log('Resultado:', JSON.stringify(testInsert, null, 2));
    }
  }

  process.exit(0);
}

checkSchema();
