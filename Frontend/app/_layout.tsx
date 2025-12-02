import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Esperar a que las fuentes carguen
        if (fontsLoaded || fontError) {
          // Verificar estado de autenticación y onboarding
          const [authToken, onboardingComplete, assessmentComplete] = await Promise.all([
            AsyncStorage.getItem('authToken'),
            AsyncStorage.getItem('onboardingComplete'),
            AsyncStorage.getItem('assessmentCompleted')
          ]);

          console.log('Estado de la app:', {
            authToken: !!authToken,
            onboardingComplete,
            assessmentComplete
          });

          // Ocultar splash screen
          await SplashScreen.hideAsync();
          setAppIsReady(true);

          // Usar setTimeout para asegurar que el Stack esté montado
          setTimeout(() => {
            // Navegar a la pantalla correcta
            if (authToken) {
              // Usuario tiene sesión activa, ir directo al menú principal
              router.replace('/(tabs)');
            } else if (onboardingComplete === 'true') {
              // Ya vio el onboarding pero no tiene sesión, ir a login
              router.replace('/login');
            } else {
              // Primera vez usando la app, mostrar onboarding
              router.replace('/onboarding');
            }
          }, 100);
        }
      } catch (e) {
        console.warn('Error al verificar autenticación:', e);
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="initialAssessment" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="perfil" />
    </Stack>
  );
}
