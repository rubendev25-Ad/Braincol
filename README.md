# Braincol - Brainsure Cuidadores

Aplicación completa para la gestión de cuidadores de personas con deterioro cognitivo, compuesta por una app móvil desarrollada con React Native (Expo) y una API REST con Node.js conectada a Supabase (PostgreSQL).

## Estructura del Proyecto

```
Braincol/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # Conexión Supabase (PostgreSQL)
│   │   │   └── inMemoryDB.js         # Base de datos en memoria (testing)
│   │   ├── controllers/
│   │   │   ├── authController.js     # Lógica de autenticación
│   │   │   └── assessmentController.js # Lógica de evaluaciones
│   │   ├── middleware/
│   │   │   └── auth.js               # Middleware JWT
│   │   ├── models/
│   │   │   └── User.js               # Modelo de Usuario (legacy)
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # Rutas de autenticación
│   │   │   ├── assessmentRoutes.js   # Rutas de evaluaciones
│   │   │   └── userRoutes.js         # Rutas de perfil de usuario
│   │   ├── utils/
│   │   │   ├── emailService.js       # Servicio de emails
│   │   │   └── validators.js         # Validadores
│   │   └── index.js                  # Servidor principal
│   ├── check-enum.js                 # Script verificación enum roles
│   ├── check-profile-column.js       # Script verificación columnas
│   ├── check-schema.js               # Script verificación esquema DB
│   ├── check-tables.js               # Script verificación tablas
│   ├── run-tests.js                  # Script de testing
│   ├── setup-assessments-table.js    # Script crear tabla evaluaciones
│   ├── test-db.js                    # Test conexión DB
│   ├── test-insert-users.js          # Test inserción usuarios
│   ├── .env                          # Variables de entorno (no subir a git)
│   ├── .gitignore
│   └── package.json
│
├── Frontend/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx           # Layout de tabs (navegación principal)
│   │   │   ├── index.tsx             # Dashboard/Menú principal
│   │   │   ├── bienestar.tsx         # Tab Bienestar
│   │   │   ├── circulo.tsx           # Tab Círculo
│   │   │   ├── paciente.tsx          # Tab Paciente
│   │   │   └── perfil.tsx            # Tab Perfil de usuario
│   │   ├── _layout.tsx               # Layout raíz con carga de fuentes
│   │   ├── index.tsx                 # Redirección inicial
│   │   ├── splash.tsx                # Pantalla de carga inicial
│   │   ├── onboarding.tsx            # Introducción de 3 slides
│   │   ├── login.tsx                 # Inicio de sesión
│   │   ├── register.tsx              # Registro de usuario
│   │   ├── verify.tsx                # Verificación de código
│   │   ├── initialAssessment.tsx     # Evaluación inicial (opcional)
│   │   ├── perfil.tsx                # Perfil de usuario (legacy/duplicado)
│   │   ├── editarPerfil.tsx          # Editar perfil de usuario
│   │   └── cambiarPassword.tsx       # Cambiar contraseña
│   ├── assets/
│   │   ├── fonts/                    # Tipografía Poppins
│   │   └── img/
│   │       └── defaultUser.png       # Imagen de perfil por defecto
│   ├── constants/
│   │   └── Colors.ts                 # Paleta de colores centralizada
│   ├── .gitignore
│   ├── app.json                      # Configuración de Expo
│   ├── package.json
│   └── tsconfig.json                 # Configuración de TypeScript
│
└── README.md                    
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Puerto 3000 disponible para el backend
- Expo Go app (opcional, para probar en dispositivo móvil)

## Instalación y Ejecución

### Backend API

1. Navegar al directorio del Backend:
```powershell
cd Backend
```

2. Instalar dependencias:
```powershell
npm install
```

3. Configurar variables de entorno:

Crea manualmente el archivo `.env` en la carpeta `Backend/` con tus credenciales de Supabase (ver sección "Variables de Entorno" más abajo).

4. Iniciar servidor de desarrollo (con auto-reload):
```powershell
npm run dev
```

5. O iniciar en modo producción:
```powershell
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Frontend Mobile

1. Navegar al directorio del Frontend:
```powershell
cd Frontend
```

2. Instalar dependencias:
```powershell
npm install
```

3. Iniciar servidor de desarrollo:
```powershell
npm start
```

Esto abrirá Expo DevTools en tu navegador. Desde ahí puedes:
- Presionar `w` para abrir en navegador web
- Escanear QR con Expo Go app (Android/iOS)
- Presionar `a` para abrir en emulador Android
- Presionar `i` para abrir en simulador iOS (solo macOS)

4. Comandos directos por plataforma:

```powershell
npm run web       # Abrir en navegador
npm run android   # Abrir en Android
npm run ios       # Abrir en iOS (solo macOS)
```

## Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js 4.18.2** - Framework web minimalista
- **Supabase (@supabase/supabase-js 2.84.0)** - Base de datos PostgreSQL en la nube
- **CORS 2.8.5** - Middleware para peticiones cross-origin
- **dotenv 16.3.1** - Manejo de variables de entorno
- **bcrypt 5.1.1 / bcryptjs 3.0.3** - Encriptación de contraseñas
- **jsonwebtoken 9.0.2** - Autenticación con JWT
- **nodemailer 7.0.10** - Servicio de envío de emails
- **nodemon 3.0.1** - Auto-reload en desarrollo

### Frontend
- **React Native 0.74.5** - Framework móvil multiplataforma
- **Expo 51.0.28** - Plataforma de desarrollo y build
- **Expo Router 3.5.23** - Navegación basada en sistema de archivos
- **TypeScript 5.1.3** - Superset tipado de JavaScript
- **Expo Font 12.0.9** - Carga de fuentes personalizadas
- **Expo Splash Screen 0.27.5** - Pantalla de carga nativa
- **Expo Image Picker 15.0.7** - Selector de imágenes
- **AsyncStorage 1.23.1** - Almacenamiento local persistente
- **React Native Web 0.19.10** - Soporte para web
- **Ionicons** - Librería de iconos

## Endpoints API Backend

### General
```
GET /
```
Retorna estado de la API, versión y endpoints disponibles.

### Autenticación (`/api/auth`)

#### Registro
```
POST /api/auth/register
Body: { 
  fullName: string,
  email: string, 
  password: string, 
  confirmPassword: string 
}
Response: { 
  success: boolean, 
  message: string, 
  data: { user, token } 
}
```
Registra un nuevo usuario. Divide `fullName` en `nombre` y `apellido`. Envía código de verificación de 6 dígitos al email.

#### Login
```
POST /api/auth/login
Body: { 
  email: string, 
  password: string 
}
Response: { 
  success: boolean, 
  message: string, 
  data: { user, token },
  needsVerification?: boolean 
}
```
Inicia sesión con email y contraseña. Requiere cuenta verificada.

#### Verificar Cuenta
```
POST /api/auth/verify
Body: { 
  email: string, 
  code: string 
}
Response: { 
  success: boolean, 
  message: string, 
  data: { user, token } 
}
```
Verifica cuenta con código de 6 dígitos enviado por email.

#### Reenviar Código
```
POST /api/auth/resend-code
Body: { email: string }
Response: { 
  success: boolean, 
  message: string 
}
```
Reenvía código de verificación al email (válido 15 min).

#### Verificar Email (sin login)
```
POST /api/auth/verify-email
Body: { 
  email: string, 
  code: string 
}
Response: { 
  success: boolean, 
  message: string 
}
```
Verifica email sin iniciar sesión automáticamente.

#### Obtener Perfil
```
GET /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { 
  success: boolean, 
  data: { user } 
}
```
Obtiene perfil del usuario autenticado.

### Evaluaciones (`/api/assessment`)

#### Guardar Evaluación Inicial
```
POST /api/assessment/initial
Headers: { Authorization: "Bearer <token>" }
Body: { 
  answers: object 
}
Response: { 
  success: boolean, 
  message: string, 
  data: { assessment } 
}
```
Guarda evaluación inicial del usuario en tabla `initial_assessments`.

### Usuario (`/api/user`)

#### Actualizar Perfil
```
PUT /api/user/profile
Headers: { Authorization: "Bearer <token>" }
Body: { 
  nombre: string,
  apellido: string,
  telefono?: string,
  direccion?: string
}
Response: { 
  success: boolean, 
  message: string, 
  data: { user } 
}
```
Actualiza datos del perfil de usuario.

#### Cambiar Contraseña
```
PUT /api/user/change-password
Headers: { Authorization: "Bearer <token>" }
Body: { 
  currentPassword: string,
  newPassword: string
}
Response: { 
  success: boolean, 
  message: string 
}
```
Cambia contraseña verificando la actual. Nueva contraseña mínimo 6 caracteres.

## Pantallas Frontend

### Flujo de Autenticación

#### 1. Splash Screen (`splash.tsx`)
- Logo animado con efecto de respiración
- Duración: 5 segundos
- Transición automática a Onboarding o Login según estado

#### 2. Onboarding (`onboarding.tsx`)
- 3 slides informativos con animaciones
- Slide 1: "Tu bienestar es nuestra prioridad"
- Slide 2: "Monitorea el progreso cognitivo"  
- Slide 3: "Conéctate con otros cuidadores"
- Navegación con swipe o botones
- Opción de saltar
- Marca flag `onboardingComplete` en AsyncStorage

#### 3. Login (`login.tsx`)
- Email y contraseña con validación inline
- Errores en rojo debajo de cada campo
- Toggle para mostrar/ocultar contraseña
- Validación: email válido, campos completos
- Mensajes específicos: "Correo o contraseña incorrectos"
- Redirección a verificación si cuenta no está verificada
- Link "¿Olvidaste tu contraseña?"
- Link para ir a registro

#### 4. Register (`register.tsx`)
- Campos: Nombre completo, Email, Contraseña, Confirmar contraseña
- Validación inline con errores en rojo:
  - Nombre mínimo 3 caracteres
  - Email válido
  - Contraseña mínimo 6 caracteres
  - Contraseñas coinciden
  - Correo ya registrado (del servidor)
- Toggles para mostrar/ocultar contraseñas
- Términos y condiciones
- Redirección automática a verificación

#### 5. Verify (`verify.tsx`)
- 6 campos para código de verificación
- Auto-focus entre campos
- Animaciones al ingresar código
- Botón para reenviar código (cooldown 60s)
- Timer visible de reenvío
- Transición animada a tabs después de verificar

#### 6. Initial Assessment (`initialAssessment.tsx` - Opcional)
- Evaluación inicial del cuidador
- Guarda respuestas en Supabase
- Marca flag `assessmentCompleted`
- **Nota:** Actualmente saltada en flujo de registro

### Navegación Principal (Tabs)

#### 7. Dashboard (`(tabs)/index.tsx`)
- Saludo personalizado con nombre del usuario
- Foto de perfil (defaultUser.png)
- Resumen del paciente (Luz María)
- Cards de estado cognitivo y bienestar
- Sección de actividades
- Navegación por tabs en la parte inferior

#### 8. Tab Bienestar (`(tabs)/bienestar.tsx`)
- Pantalla de bienestar del paciente
- [Por implementar completamente]

#### 9. Tab Círculo (`(tabs)/circulo.tsx`)
- Red de soporte del cuidador
- [Por implementar completamente]

#### 10. Tab Paciente (`(tabs)/paciente.tsx`)
- Información del paciente
- [Por implementar completamente]

#### 11. Tab Perfil (`(tabs)/perfil.tsx`)
- Foto de perfil (defaultUser.png o foto_perfil)
- Nombre completo y email del usuario
- Rol del usuario (Cuidador/Admin/Paciente)
- Secciones:
  - Mi Cuenta: Editar perfil, Notificaciones, Preferencias
  - Soporte: Preguntas frecuentes, Contáctanos
  - Cerrar sesión (con limpieza de AsyncStorage)
- Navegación a editar perfil

### Gestión de Perfil

#### 12. Editar Perfil (`editarPerfil.tsx`)
- Header con botón atrás
- Foto de perfil circular con botón de edición
- Formulario:
  - Nombre
  - Apellido
  - Email (no editable)
  - Contraseña (botón "Cambiar" → nueva pantalla)
  - Teléfono (solo números, +, -, espacios)
  - Dirección
- Botones fijos en footer:
  - Guardar Cambios (actualiza Supabase + AsyncStorage)
  - Cancelar
- Selector de imagen con expo-image-picker

#### 13. Cambiar Contraseña (`cambiarPassword.tsx`)
- Campos:
  - Contraseña actual
  - Nueva contraseña
  - Confirmar nueva contraseña
- Toggles para mostrar/ocultar cada contraseña
- Validaciones:
  - Contraseña actual correcta
  - Nueva contraseña mínimo 6 caracteres
  - Confirmación coincide
- Conectado con endpoint `/api/user/change-password`

## Paleta de Colores

```typescript
// Frontend/constants/Colors.ts
export const Colors = {
  blancoNube: '#F7F9FA',      // Fondo principal
  azulSuave: '#B3D4FF',       // Accentos suaves
  lilaSuave: '#A6A8F0',       // Color secundario
  grisPerla: '#707B8C',       // Textos secundarios, iconos
  azulNeuro: '#5C6BC0',       // Color principal, botones
  
  primary: '#5C6BC0',
  secondary: '#A6A8F0',
  background: '#F7F9FA',
  white: '#FFFFFF',
  
  text: {
    primary: '#1A1A1A',
    secondary: '#707B8C',
    placeholder: '#9CA3AF',
  },
  
  border: '#E5E7EB',
  facebook: '#1877F2',
  google: '#707B8C',          // Gris para Google
};
```

## Variables de Entorno (Backend)

Crear archivo `.env` en la carpeta `Backend/` (basándote en tus credenciales de Supabase):

**Nota:** No existe archivo `.env.example` en el proyecto. Crea `.env` directamente con:

```env
PORT=3000
NODE_ENV=development

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-anon-key-publica
SUPABASE_SERVICE_KEY=tu-service-role-key-privada

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=Brainsure Cuidadores <noreply@brainsure.com>
```

### Notas importantes:
- **SUPABASE_SERVICE_KEY**: Se usa para bypass de RLS (Row Level Security)
- **SMTP_PASS**: Usa contraseña de aplicación de Gmail, no tu contraseña normal
- **JWT_SECRET**: Genera una clave segura aleatoria para producción
- Nunca subir el archivo `.env` a git (ya está en `.gitignore`)

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicacion
EMAIL_FROM=Brainsure Cuidadores <noreply@brainsure.com>
```

### Notas importantes:
- **SUPABASE_SERVICE_KEY**: Se usa en producción para bypass de RLS (Row Level Security)
- **SMTP_PASS**: Usa contraseña de aplicación de Gmail, no tu contraseña normal
- **JWT_SECRET**: Genera una clave segura aleatoria para producción
- Nunca subir el archivo `.env` a git (ya está en `.gitignore`)

## Comandos Útiles

### Backend
```powershell
npm run dev          # Desarrollo con auto-reload
npm start            # Producción
npm install <pkg>    # Instalar dependencia
```

### Frontend
```powershell
npm start            # Iniciar Expo DevTools
npm run web          # Abrir en navegador
npm run android      # Abrir en Android
npm run ios          # Abrir en iOS
npx expo start -c    # Limpiar caché y iniciar
npm install <pkg>    # Instalar dependencia
```

## Base de Datos (Supabase PostgreSQL)

### Configuración SQL

Ejecuta las siguientes consultas SQL en el **SQL Editor de Supabase**:

```sql
-- Asegurarse que la tabla usuarios tenga todas las columnas necesarias
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS direccion TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS foto_perfil TEXT;

-- Crear tabla de evaluaciones iniciales (si no existe)
CREATE TABLE IF NOT EXISTS initial_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  answers JSONB NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_initial_assessments_modtime
BEFORE UPDATE ON initial_assessments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
```

### Tablas principales

#### `usuarios`
Tabla de usuarios del sistema.

```sql
Columnas:
- id (uuid, PK)
- auth_id (text, unique)
- nombre (text)
- apellido (text)
- correo (text, unique)
- contraseña (text, hashed)
- telefono (text, nullable)
- fecha_nacimiento (date, nullable)
- genero (text, nullable)
- rol (enum: 'cuidador', 'admin', 'paciente')
- activo (boolean, default: false)
- codigo_expira (timestamp, nullable)
- id_de_autenticación (text, nullable) - Código de verificación
- foto_perfil (text, nullable) - URL de foto
- direccion (text, nullable)
- creado_en (timestamp, default: now())
- actualizado_en (timestamp, default: now())
```

#### `initial_assessments`
Evaluaciones iniciales de los cuidadores.

```sql
Columnas:
- id (uuid, PK)
- user_id (uuid, FK → usuarios.id)
- answers (jsonb) - Respuestas del cuestionario
- creado_en (timestamp, default: now())
- actualizado_en (timestamp, default: now())
```

### Scripts de verificación del Backend

El proyecto incluye varios scripts para verificar el estado de la base de datos:

- **`check-tables.js`**: Verifica que existan las tablas necesarias
- **`check-schema.js`**: Muestra el esquema completo de la tabla `usuarios`
- **`check-profile-column.js`**: Verifica columnas de perfil (foto_perfil, direccion)
- **`check-enum.js`**: Verifica el tipo enum de roles
- **`setup-assessments-table.js`**: Script para crear tabla de evaluaciones
- **`test-db.js`**: Prueba conexión a Supabase
- **`test-insert-users.js`**: Prueba inserción de usuarios de prueba

### Configuración Row Level Security (RLS)

El backend usa `SUPABASE_SERVICE_KEY` para bypass de RLS, permitiendo operaciones sin restricciones de seguridad a nivel de fila. En producción, considera implementar políticas RLS adecuadas.

## Flujo de Navegación y Persistencia de Sesión

### Flujo principal
```
Splash (5s) 
  ↓
¿Primera vez? 
  ├─ Sí → Onboarding (3 slides) → Login
  └─ No → ¿Tiene sesión?
           ├─ Sí → Dashboard (tabs)
           └─ No → Login
```

### Flujo de registro
```
Register → Verify (código 6 dígitos) → Dashboard (tabs)
```

### Gestión de sesión (AsyncStorage)

El `_layout.tsx` raíz verifica al inicio:

1. **`authToken`**: Token JWT del usuario
   - Existe → Va a Dashboard
   - No existe → Continúa verificación

2. **`onboardingComplete`**: Flag de onboarding visto
   - 'true' → Va a Login
   - No existe → Muestra Onboarding

3. **`userData`**: Datos del usuario en JSON
   - Se actualiza en login, verify, editar perfil

4. **`assessmentCompleted`**: Flag de evaluación inicial (opcional)
   - Actualmente no bloquea navegación

### Cerrar sesión

Al cerrar sesión desde perfil, se eliminan:
- `authToken`
- `userData`
- `tempToken`
- `userEmail`
- `assessmentCompleted`
- `onboardingComplete`

Y redirige a Login.

## Características Implementadas

### Backend
- ✅ API REST completa con Express
- ✅ Supabase PostgreSQL como base de datos
- ✅ Arquitectura MVC (Model-View-Controller)
- ✅ Sistema de autenticación JWT completo
- ✅ Registro con división automática de nombre completo
- ✅ Verificación de cuenta con código de 6 dígitos (email)
- ✅ Login con validación de credenciales y cuenta activa
- ✅ Reenvío de código de verificación con cooldown
- ✅ Middleware de autenticación para rutas protegidas
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Validación de datos (email, password, nombre)
- ✅ Manejo centralizado de errores con mensajes en español
- ✅ Servicio de emails con nodemailer
- ✅ CRUD de perfil de usuario (actualizar datos personales)
- ✅ Cambio de contraseña con verificación de contraseña actual
- ✅ Guardado de evaluaciones iniciales
- ✅ Soporte para nombres de campos en inglés y español
- ✅ Variables de entorno con dotenv
- ✅ CORS configurado

### Frontend
- ✅ Navegación con Expo Router (file-based routing)
- ✅ 13 pantallas completas implementadas
- ✅ Sistema de tabs para navegación principal
- ✅ Persistencia de sesión con AsyncStorage
- ✅ Onboarding solo en primera ejecución
- ✅ Auto-login si hay sesión activa
- ✅ Validación inline de formularios
- ✅ Mensajes de error en rojo debajo de cada campo
- ✅ Errores específicos del servidor
- ✅ Toggle para mostrar/ocultar contraseñas
- ✅ Validación de teléfono (solo números, +, -, espacios)
- ✅ Pantalla de perfil con datos del usuario
- ✅ Edición completa de perfil conectada a backend
- ✅ Cambio de contraseña con validaciones
- ✅ Selector de imagen de perfil (expo-image-picker)
- ✅ Imagen de perfil por defecto
- ✅ Cierre de sesión con limpieza de datos
- ✅ Animaciones suaves entre pantallas
- ✅ Diseño responsive y adaptable
- ✅ Tipografía Poppins cargada correctamente
- ✅ Paleta de colores consistente
- ✅ Iconos de Ionicons
- ✅ Soporte para web, iOS y Android
- ✅ KeyboardAvoidingView en formularios

## Próximas Implementaciones

### Backend
- [ ] Upload real de imágenes (Supabase Storage)
- [ ] Recuperación de contraseña por email
- [ ] Modelo y CRUD de Pacientes
- [ ] Modelo y CRUD de Actividades cognitivas
- [ ] Sistema de notificaciones push
- [ ] Roles y permisos granulares
- [ ] Logger de actividades (Winston/Morgan)
- [ ] Rate limiting para prevenir ataques
- [ ] Pruebas unitarias (Jest)
- [ ] Documentación con Swagger
- [ ] Refresh tokens
- [ ] Webhooks
- [ ] Políticas RLS en Supabase

### Frontend
- [ ] Implementar completamente tabs: Bienestar, Círculo, Paciente
- [ ] Notificaciones push
- [ ] Upload real de foto de perfil a Supabase Storage
- [ ] Caché de imágenes
- [ ] Estados de carga global (Context API)
- [ ] Manejo de errores con toast/snackbar
- [ ] Pull to refresh en listas
- [ ] Scroll infinito
- [ ] Modo offline
- [ ] Internacionalización (i18n)
- [ ] Modo oscuro
- [ ] Onboarding interactivo mejorado
- [ ] Tutorial in-app
- [ ] Pantallas de actividades cognitivas
- [ ] Dashboard con gráficas de progreso
- [ ] Chat/mensajería entre cuidadores

## Notas de Desarrollo

### Backend
- La base de datos es **Supabase (PostgreSQL)**, no MongoDB
- Se usa `SUPABASE_SERVICE_KEY` para bypass de Row Level Security
- Los códigos de verificación expiran en 15 minutos
- Los tokens JWT expiran en 7 días (configurable)
- El servidor acepta campos en inglés y español (email/correo, password/contraseña)
- Puerto por defecto: 3000 (configurable en `.env`)
- Nodemailer configurado para Gmail (requiere contraseña de aplicación)

### Frontend
- Las fuentes Poppins están en `Frontend/assets/fonts/`
- La navegación usa file-based routing de Expo Router
- Los colores están centralizados en `constants/Colors.ts`
- TypeScript configurado para type-safety
- AsyncStorage guarda: authToken, userData, onboardingComplete, assessmentCompleted
- La imagen por defecto está en `assets/img/defaultUser.png`
- El teléfono solo acepta: números, +, -, espacios
- Los errores de formulario se muestran en rojo (#EF4444) debajo de cada campo

### Estructura de datos en AsyncStorage
```typescript
authToken: string           // JWT token
userData: {                 // Usuario completo
  id: string,
  nombre: string,
  apellido: string,
  correo: string,
  rol: 'cuidador' | 'admin' | 'paciente',
  foto_perfil?: string,
  telefono?: string,
  direccion?: string,
  // ... otros campos
}
onboardingComplete: 'true'  // String, no boolean
assessmentCompleted: 'true' // String, no boolean
tempToken: string           // Token temporal durante registro
userEmail: string           // Email temporal durante registro
```

## Git y Control de Versiones

Archivos ignorados por git:
- `node_modules/` (ambos proyectos)
- `.env` (Backend)
- `.expo/` (Frontend)
- Archivos de log
- Archivos del sistema operativo

## Licencia

ISC
