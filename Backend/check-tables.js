require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkTables() {
  console.log('🔍 Verificando tablas en Supabase...\n');

  // Intentar verificar tabla de assessments
  const { data: assessments, error: assessError } = await supabase
    .from('assessments')
    .select('*')
    .limit(1);

  if (assessError) {
    console.log('❌ Tabla "assessments" no existe o tiene problemas:');
    console.log('   ', assessError.message);
  } else {
    console.log('✅ Tabla "assessments" existe');
    if (assessments.length > 0) {
      console.log('   Columnas:', Object.keys(assessments[0]).join(', '));
    }
  }

  // Verificar otras posibles tablas
  const possibleTables = ['initial_assessments', 'user_assessments', 'evaluaciones'];
  
  for (const tableName of possibleTables) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (!error) {
      console.log(`✅ Tabla "${tableName}" existe`);
      if (data.length > 0) {
        console.log('   Columnas:', Object.keys(data[0]).join(', '));
      }
    }
  }

  process.exit(0);
}

checkTables();
