require('dotenv').config({ path: __dirname + '/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkProfileColumn() {
  console.log('🔍 Verificando estructura de la tabla users...\n');

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error);
  } else {
    if (data && data.length > 0) {
      console.log('✅ Columnas encontradas:');
      const columns = Object.keys(data[0]);
      columns.forEach(col => console.log(`   - ${col}`));
      
      if (columns.includes('foto_perfil') || columns.includes('profile_image')) {
        console.log('\n✅ La columna de foto de perfil ya existe');
      } else {
        console.log('\n⚠️  No se encontró columna para foto de perfil');
        console.log('Necesitas ejecutar este SQL en Supabase:');
        console.log('\nALTER TABLE users ADD COLUMN foto_perfil TEXT;');
      }
    }
  }

  process.exit(0);
}

checkProfileColumn();
