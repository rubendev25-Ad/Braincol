# Brainsure Cuidadores - Frontend Mobile

App móvil desarrollada con React Native y Expo.

## 🚀 Instalación

1. **Instalar dependencias:**
```powershell
npm install
```

2. **Descargar fuentes Poppins:**
   - Ve a: https://fonts.google.com/specimen/Poppins
   - Descarga: Poppins-Regular.ttf, Poppins-Medium.ttf, Poppins-SemiBold.ttf, Poppins-Bold.ttf
   - Colócalas en: `assets/fonts/`

3. **Iniciar la app:**
```powershell
npm start
```

## 📱 Ejecutar en dispositivo

### Android:
```powershell
npm run android
```

### iOS:
```powershell
npm run ios
```

### Web:
```powershell
npm run web
```

## 📂 Estructura del proyecto

```
Frontend/
├── app/                    # Pantallas de la app
│   ├── _layout.tsx        # Layout principal y configuración de fuentes
│   └── index.tsx          # Pantalla de login
├── assets/                # Recursos estáticos
│   └── fonts/            # Fuentes Poppins
├── components/           # Componentes reutilizables
├── constants/           # Constantes (colores, etc)
│   └── Colors.ts
├── app.json            # Configuración de Expo
└── package.json
```

## 🎨 Características

- ✅ Pantalla de Login con diseño moderno
- ✅ Tipografía Poppins
- ✅ Colores personalizados
- ✅ Integración con Facebook y Google (UI)
- ✅ Diseño responsive
- ✅ Navegación con Expo Router

## 🔧 Tecnologías

- React Native
- Expo
- Expo Router
- TypeScript
- Expo Font
