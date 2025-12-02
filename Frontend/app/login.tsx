import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Detectar plataforma y usar la URL correcta
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else {
    // iOS o dispositivo físico - usar IP local de tu computadora
    return 'http://192.168.1.100:3000/api'; // Cambiar por tu IP local
  }
};

const API_URL = getApiUrl();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');

    let hasError = false;

    // Validar email
    if (!email.trim()) {
      setEmailError('El correo electrónico es obligatorio');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Por favor ingresa un correo electrónico válido');
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        
        // Si el usuario no está verificado
        if (data.needsVerification) {
          setEmailError('Por favor verifica tu cuenta primero');
          setTimeout(() => {
            router.push({
              pathname: '/verify',
              params: { email: email.trim().toLowerCase() }
            });
          }, 1500);
          return;
        }

        // Error de credenciales
        if (response.status === 401) {
          setPasswordError('Correo o contraseña incorrectos');
        } else {
          setEmailError(data.message || 'Error al iniciar sesión');
        }
        return;
      }

      // Guardar token y datos del usuario
      await AsyncStorage.setItem('authToken', data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));

      // Navegar al dashboard
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error en login:', error);
      setEmailError('No se pudo conectar con el servidor');
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.brandText}>Brainsure Cuidadores</Text>
              <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, emailError && styles.inputError]}
                  placeholder="Correo electrónico"
                  placeholderTextColor={Colors.text.placeholder}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, passwordError && styles.inputError]}
                    placeholder="Contraseña"
                    placeholderTextColor={Colors.text.placeholder}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={22}
                      color={Colors.text.placeholder}
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Social Login */}
            <View style={styles.socialSection}>
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.orText}>O inicia sesión con</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleFacebookLogin}
                >
                  <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                >
                  <Ionicons name="logo-google" size={20} color="#707B8C" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Link */}
            <View style={styles.registerSection}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  brandText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Poppins-Regular',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: 'Poppins-Regular',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  socialSection: {
    marginBottom: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    color: Colors.text.secondary,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Poppins-Medium',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  registerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});
