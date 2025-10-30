# Braincol - Brainsure Cuidadores

Aplicación completa para la gestión de cuidadores de personas con deterioro cognitivo, compuesta por una app móvil y una API REST.

## Estructura del Proyecto

```
Braincol/
├── Backend/
│   ├── src/
│   │   └── index.js          # Punto de entrada de la API
│   ├── .env.example          # Variables de entorno de ejemplo
│   ├── .gitignore
│   ├── package.json
├── Frontend/
│   ├── app/
│   │   ├── _layout.tsx       # Configuración del layout y fuentes
│   │   └── index.tsx         # Pantalla de login
│   ├── assets/
│   │   └── fonts/            # Fuentes Poppins
│   ├── components/           # Componentes reutilizables
│   ├── constants/
│   │   └── Colors.ts         # Paleta de colores
│   ├── app.json              # Configuración de Expo
│   ├── package.json
└── README.md                 
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (se instala automáticamente con el frontend)

## Instalación y Ejecución

### Backend

1. Navegar al directorio del Backend:
```powershell
cd Backend
```

2. Instalar dependencias:
```powershell
npm install
```

3. Configurar variables de entorno:
```powershell
copy .env.example .env
```

4. Iniciar el servidor:
```powershell
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Frontend

1. Navegar al directorio del Frontend:
```powershell
cd Frontend
```

2. Instalar dependencias:
```powershell
npm install
```

3. Iniciar la app:
```powershell
npm start
```

Para plataformas específicas:
- Web: `npm run web`
- Android: `npm run android`
- iOS: `npm run ios`

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- JWT para autenticación
- bcrypt para encriptación de contraseñas
- CORS
- dotenv

### Frontend
- React Native 0.74.5
- Expo 51.0.28
- Expo Router (Navegación)
- TypeScript
- Expo Font (Tipografía Poppins)
- Ionicons

## Características Implementadas

### Backend API
- Endpoints de autenticación (login, register, forgot-password)
- Middleware de CORS configurado
- Estructura lista para expansión
- Variables de entorno para configuración

### Frontend Mobile
- Pantalla de login con diseño moderno
- Autenticación con correo y contraseña
- Recuperación de contraseña
- Inicio de sesión con Facebook y Google
- Enlace a registro de nuevos usuarios
- Diseño responsive
- Paleta de colores personalizada

## Paleta de Colores

- Blanco Nube: #F7F9FA
- Azul Suave: #B3D4FF
- Lila Suave: #A6A8F0
- Gris Perla: #707B8C
- Azul Neuro: #5C6BC0

## Endpoints Disponibles

### General
- `GET /` - Estado de la API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/forgot-password` - Recuperar contraseña

## Próximas Implementaciones

### Backend
- Conexión a base de datos
- Modelos de datos
- Controladores separados
- Middleware de autenticación JWT
- Validación de datos con express-validator
- Manejo centralizado de errores
- Rutas adicionales para gestión de usuarios

### Frontend
- Pantalla de registro
- Pantalla de recuperación de contraseña
- Onboarding inicial
- Dashboard principal
- Navegación completa
- Integración con el backend
- Manejo de tokens JWT
- Estados de carga y errores

## Notas de Desarrollo

- Las fuentes Poppins están incluidas en `Frontend/assets/fonts/`
- La configuración de navegación usa Expo Router
- Los colores están centralizados en `Frontend/constants/Colors.ts`
- El backend usa Express con una arquitectura lista para escalar
- Variables de entorno configurables para diferentes ambientes
