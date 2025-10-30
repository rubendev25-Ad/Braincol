import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function SplashScreen() {
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Fade in inicial
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animación de "respiración" del logo
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.15,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    breatheAnimation.start();

    // Mostrar spinner después de 3 segundos
    const spinnerTimer = setTimeout(() => {
      setShowSpinner(true);
    }, 3000);

    // Simular carga y navegar al login después de 4-5 segundos
    const navigationTimer = setTimeout(() => {
      router.replace('/index');
    }, 5000);

    return () => {
      breatheAnimation.stop();
      clearTimeout(spinnerTimer);
      clearTimeout(navigationTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: breatheAnim }],
          },
        ]}
      >
        {/* Logo circular con icono */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>B</Text>
        </View>
        
        {/* Nombre de la marca */}
        <Text style={styles.brandName}>Brainsure</Text>
        <Text style={styles.brandSubtitle}>Cuidadores</Text>
      </Animated.View>

      {/* Spinner que aparece después de 3 segundos */}
      {showSpinner && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 64,
    fontFamily: 'Poppins-Bold',
    color: Colors.primary,
    letterSpacing: -2,
  },
  brandName: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    opacity: 0.9,
    letterSpacing: 2,
  },
  spinnerContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
});
