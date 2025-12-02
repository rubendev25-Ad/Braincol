require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createTable() {
  console.log('📋 Creando tabla initial_assessments en Supabase...\n');

  try {
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create-assessments-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚠️  IMPORTANTE: Este script no puede ejecutar SQL directamente.');
    console.log('📝 Por favor, copia y pega el siguiente SQL en el SQL Editor de Supabase:\n');
    console.log('=' .repeat(80));
    console.log(sql);
    console.log('=' .repeat(80));
    console.log('\n🔗 Abre: https://supabase.com/dashboard/project/oiitjdgfrvsxtodslfkr/sql/new');
    console.log('\n✅ Después de ejecutar el SQL, vuelve a intentar la evaluación inicial.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

createTable();
