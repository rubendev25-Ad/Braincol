# Braincol - Brainsure Cuidadores

Aplicación completa para la gestión de cuidadores de personas con deterioro cognitivo, compuesta por una app móvil desarrollada con React Native y una API REST con Node.js.

## Estructura del Proyecto

```
Braincol/
├── Backend/
│   ├── src/
│   │   └── index.js              # API REST con Express
│   ├── .env                      # Variables de entorno (no subir a git)
│   ├── .env.example              # Plantilla de variables de entorno
│   ├── .gitignore
│   └── package.json
│
├── Frontend/
│   ├── app/
│   │   ├── _layout.tsx           # Layout principal y carga de fuentes
│   │   ├── index.tsx             # Redirección inicial
│   │   ├── splash.tsx            # Pantalla de carga inicial
│   │   ├── onboarding.tsx        # Introducción de 3 slides
│   │   ├── login.tsx             # Inicio de sesión
│   │   ├── register.tsx          # Registro de usuario
│   │   └── verify.tsx            # Verificación de código
│   ├── assets/
│   │   └── fonts/                # Tipografía Poppins (Regular, Medium, SemiBold, Bold)
│   ├── components/               # Componentes reutilizables
│   ├── constants/
│   │   └── Colors.ts             # Paleta de colores centralizada
│   ├── .gitignore
│   ├── app.json                  # Configuración de Expo
│   ├── package.json
│   └── tsconfig.json             # Configuración de TypeScript
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

3. Configurar variables de entorno (primera vez):
```powershell
copy .env.example .env
```
Edita el archivo `.env` y configura las variables necesarias.

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
- **CORS 2.8.5** - Middleware para peticiones cross-origin
- **dotenv 16.3.1** - Manejo de variables de entorno
- **body-parser 1.20.2** - Parseo de peticiones HTTP
- **bcrypt 5.1.1** - Encriptación de contraseñas
- **jsonwebtoken 9.0.2** - Autenticación con JWT
- **nodemon 3.0.1** - Auto-reload en desarrollo

### Frontend
- **React Native 0.74.5** - Framework móvil multiplataforma
- **Expo 51.0.28** - Plataforma de desarrollo y build
- **Expo Router 3.5.23** - Navegación basada en sistema de archivos
- **TypeScript 5.1.3** - Superset tipado de JavaScript
- **Expo Font 12.0.9** - Carga de fuentes personalizadas
- **Expo Splash Screen 0.27.5** - Pantalla de carga nativa
- **React Native Web 0.19.10** - Soporte para web
- **Ionicons** - Librería de iconos

## Endpoints API Backend

### General
```
GET /
```
Retorna estado de la API y versión.

### Autenticación
```
POST /api/auth/login
Body: { email: string, password: string }
```
Inicia sesión con email y contraseña.

```
POST /api/auth/register
Body: { email: string, password: string, name: string }
```
Registra un nuevo usuario.

```
POST /api/auth/forgot-password
Body: { email: string }
```
Solicita recuperación de contraseña.

## Pantallas Frontend

### 1. Splash Screen
- Logo animado con efecto de respiración
- Duración: 5 segundos
- Transición automática a Onboarding

### 2. Onboarding (3 Slides)
- Slide 1: "Tu bienestar es nuestra prioridad"
- Slide 2: "Monitorea el progreso cognitivo"
- Slide 3: "Conéctate con otros cuidadores"
- Navegación con swipe o botones
- Opción de saltar

### 3. Login
- Campos de email y contraseña
- Botón de inicio de sesión
- Link "¿Olvidaste tu contraseña?"
- Botones de login social (Facebook, Google)
- Link para registro

### 4. Register
- Nombre completo
- Email
- Contraseña (con toggle de visibilidad)
- Confirmación de contraseña
- Checkbox de términos y condiciones
- Botón de registro

### 5. Verify
- 6 campos para código de verificación
- Auto-focus entre campos
- Botón para reenviar código
- Timer de reenvío

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

```env
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala
JWT_EXPIRES_IN=7d

# Base de datos (por configurar)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=braincol
# DB_USER=postgres
# DB_PASSWORD=
```

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

## Flujo de Navegación

```
Splash (5s) → Onboarding (3 slides) → Login
                                        ↓
                                    Register → Verify
                                        ↓
                                   (Dashboard - próximamente)
```

## Características Implementadas

### Backend
- API REST funcional con Express
- Estructura de endpoints de autenticación
- Middleware de CORS configurado
- Variables de entorno con dotenv
- Scripts de desarrollo y producción
- Preparado para JWT y bcrypt

### Frontend
- Sistema de navegación con Expo Router
- 6 pantallas completas de autenticación
- Animaciones suaves entre pantallas
- Diseño responsive (adaptable a todos los tamaños)
- Tipografía Poppins cargada correctamente
- Paleta de colores consistente
- Iconos de Ionicons
- Soporte para web, iOS y Android
- Inputs con validación visual
- Botones de login social (UI)

## Próximas Implementaciones

### Backend
- Conexión a base de datos (PostgreSQL/MongoDB)
- Modelos y esquemas de datos
- Controladores separados por módulo
- Middleware de autenticación JWT activo
- Validación de datos con express-validator
- Manejo centralizado de errores
- Logger (Winston/Morgan)
- Rate limiting
- Rutas de usuarios, perfiles, notificaciones

### Frontend
- Dashboard principal
- Perfil de usuario
- Configuración de cuenta
- Notificaciones push
- Integración real con backend
- Manejo de tokens JWT
- Estados de carga global
- Manejo de errores con toast/snackbar
- Almacenamiento local (AsyncStorage)
- Internacionalización (i18n)

## Notas de Desarrollo

### Frontend
- Las fuentes Poppins están en `Frontend/assets/fonts/`
- La navegación usa file-based routing de Expo Router
- Los colores están centralizados en `constants/Colors.ts`
- TypeScript configurado para type-safety
- Componentes optimizados para performance
- Animaciones nativas con Animated API

### Backend
- Express configurado con arquitectura MVC lista para escalar
- CORS permite todas las origins (cambiar en producción)
- El archivo `.env` NO debe subirse a git
- Puerto por defecto: 3000 (configurable en `.env`)
- Preparado para agregar base de datos fácilmente

## Git y Control de Versiones

Archivos ignorados por git:
- `node_modules/` (ambos proyectos)
- `.env` (Backend)
- `.expo/` (Frontend)
- Archivos de log
- Archivos del sistema operativo

## Licencia

ISC
