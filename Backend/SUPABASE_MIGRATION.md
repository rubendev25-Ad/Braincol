# 🔄 Migración a Supabase

## Estado Actual
El backend actualmente usa **almacenamiento en memoria** para simular una base de datos. Esto significa que:
- ✅ Todas las funciones funcionan perfectamente
- ⚠️ Los datos se pierden al reiniciar el servidor
- 📝 Ideal para desarrollo y pruebas

## Cuando Tengas Credenciales de Supabase

### Paso 1: Instalar Cliente de Supabase
```powershell
cd Backend
npm install @supabase/supabase-js
```

### Paso 2: Configurar Variables de Entorno
Edita `Backend/.env` y agrega:
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_KEY=tu_supabase_service_role_key
```

### Paso 3: Crear Archivo de Configuración de Supabase
Crea `Backend/src/config/supabase.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️  Credenciales de Supabase no configuradas. Usando almacenamiento en memoria.');
}

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

module.exports = supabase;
```

### Paso 4: Crear Tablas en Supabase

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  profile_image TEXT,
  role TEXT DEFAULT 'cuidador' CHECK (role IN ('cuidador', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos de verificación
CREATE TABLE verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de códigos de recuperación
CREATE TABLE reset_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_reset_codes_email ON reset_codes(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Paso 5: Actualizar database.js
Reemplaza `Backend/src/config/database.js`:

```javascript
const supabase = require('./supabase');

const connectDB = async () => {
  if (supabase) {
    try {
      // Verificar conexión
      const { data, error } = await supabase.from('users').select('count');
      
      if (error) throw error;
      
      console.log(`
        ========================================
        💾 BASE DE DATOS
        ========================================
        ✅ Supabase conectado exitosamente
        📊 Modo: Producción (datos persistentes)
        ========================================
      `);
    } catch (error) {
      console.error('❌ Error conectando a Supabase:', error.message);
      console.log('⚠️  Usando almacenamiento en memoria como fallback');
    }
  } else {
    console.log(`
      ========================================
      💾 BASE DE DATOS
      ========================================
      Modo: Almacenamiento en memoria (temporal)
      
      ⚠️  Los datos se perderán al reiniciar el servidor
      
      ✅ Cuando tengas credenciales de Supabase:
         - Actualiza SUPABASE_URL y SUPABASE_KEY en .env
         - Los datos se persistirán en la nube
      ========================================
    `);
  }
};

module.exports = connectDB;
```

### Paso 6: Actualizar User Model
Modifica `Backend/src/models/User.js` para detectar si Supabase está disponible:

```javascript
const bcrypt = require('bcrypt');
const supabase = require('../config/supabase');
const inMemoryDB = require('../config/inMemoryDB');

// Usar Supabase si está disponible, sino usar memoria
const useSupabase = !!supabase;

class User {
  // ... mantener todo el código actual ...
  
  // Ejemplo de método create con Supabase:
  static async create(userData) {
    if (useSupabase) {
      // Implementación con Supabase
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            full_name: userData.fullName,
            email: userData.email.toLowerCase(),
            password: hashedPassword,
            is_verified: false,
            role: userData.role || 'cuidador'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      return new User({
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        password: data.password,
        isVerified: data.is_verified,
        role: data.role,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      });
    } else {
      // Usar implementación en memoria actual
      // ... código actual ...
    }
  }
  
  // Hacer lo mismo con todos los métodos...
}
```

## Ventajas de Supabase

- ✅ **PostgreSQL**: Base de datos relacional robusta
- ✅ **Tiempo Real**: Actualizaciones en vivo
- ✅ **Auth Built-in**: Sistema de autenticación integrado
- ✅ **Storage**: Almacenamiento de archivos
- ✅ **Edge Functions**: Funciones serverless
- ✅ **Dashboard**: Panel visual para gestión
- ✅ **Backups automáticos**: Copias de seguridad
- ✅ **Escalable**: Crece con tu aplicación

## Migración de Datos

Si ya tienes datos en memoria que quieres migrar:

```javascript
// Script de migración (ejecutar una sola vez)
const inMemoryDB = require('./config/inMemoryDB');
const supabase = require('./config/supabase');

async function migrateData() {
  const users = inMemoryDB.getAllUsers();
  
  for (const user of users) {
    await supabase.from('users').insert([{
      full_name: user.fullName,
      email: user.email,
      password: user.password,
      is_verified: user.isVerified,
      role: user.role
    }]);
  }
  
  console.log(`✅ Migrados ${users.length} usuarios`);
}

migrateData();
```

## Notas Importantes

1. **El código actual seguirá funcionando** - Solo necesitas actualizar cuando tengas Supabase
2. **No hay prisa** - Desarrolla tranquilo con memoria
3. **Migración simple** - Solo cambiar la capa de datos
4. **Sin cambios en el frontend** - La API mantiene la misma interfaz

---

**Estado actual:** ✅ Funcionando con almacenamiento en memoria  
**Próximo paso:** Integrar Supabase cuando tengas credenciales