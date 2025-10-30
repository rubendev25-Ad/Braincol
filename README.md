# Braincol - Brainsure Cuidadores

Aplicación móvil para la gestión de cuidadores desarrollada con React Native y Expo.

## Estructura del Proyecto

```
Braincol/
├── Backend/
│   └── Vacío por el momento
├── Frontend/
│   ├── app/
│   │   ├── _layout.tsx          # Configuración del layout y fuentes
│   │   └── index.tsx             # Pantalla de login
│   ├── assets/
│   │   └── fonts/                # Fuentes Poppins
│   ├── components/               # Componentes reutilizables
│   ├── constants/
│   │   └── Colors.ts             # Paleta de colores
│   ├── app.json                  # Configuración de Expo
│   ├── package.json              # Dependencias del proyecto
│   └── README.md                 # Documentación del frontend
└── README.md                     # Este archivo
```

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (se instala automáticamente)

## Instalación y Ejecución del Frontend

### 1. Navegar al directorio del Frontend

```powershell
cd Frontend
```

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Iniciar el proyecto

Para iniciar el servidor de desarrollo de Expo:

```powershell
npm start
```

Esto abrirá Expo Dev Tools en tu navegador donde podrás:
- Escanear el código QR con la app Expo Go en tu dispositivo móvil
- Ejecutar en un emulador/simulador
- Ver en el navegador web

### 4. Ejecutar en plataformas específicas

#### Web (Navegador)
```powershell
npm run web
```

#### Android (Emulador o dispositivo)
```powershell
npm run android
```

#### iOS (Simulador o dispositivo - solo en macOS)
```powershell
npm run ios
```

## Tecnologías Utilizadas

### Frontend
- React Native 0.74.5
- Expo 51.0.28
- Expo Router (Navegación)
- TypeScript
- Expo Font (Tipografía Poppins)

## Características Implementadas

### Pantalla de Login
- Autenticación con correo y contraseña
- Recuperación de contraseña
- Inicio de sesión con Facebook
- Inicio de sesión con Google
- Registro de nuevos usuarios
- Diseño responsive
- Paleta de colores personalizada

## Paleta de Colores

- Blanco Nube: #F7F9FA
- Azul Suave: #B3D4FF
- Lila Suave: #A6A8F0
- Gris Perla: #707B8C
- Azul Neuro: #5C6BC0

## Comandos Útiles

```powershell
# Instalar una nueva dependencia
npm install <nombre-paquete>

# Limpiar caché de Expo
npx expo start -c

# Ver versión de Expo
npx expo --version

# Actualizar dependencias
npm update
```

## Notas de Desarrollo

- Las fuentes Poppins están incluidas en `assets/fonts/`
- La configuración de navegación usa Expo Router
- Los colores están centralizados en `constants/Colors.ts`
- El proyecto usa TypeScript para type safety

