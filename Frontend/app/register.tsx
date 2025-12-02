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
    return 'http://localhost:3000';
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  } else {
    return 'http://192.168.1.100:3000';
  }
};

const API_URL = getApiUrl();

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    // Limpiar errores previos
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Validar nombre completo
    if (!fullName.trim()) {
      setFullNameError('El nombre completo es obligatorio');
      hasError = true;
    } else if (fullName.trim().length < 3) {
      setFullNameError('El nombre debe tener al menos 3 caracteres');
      hasError = true;
    }

    // Validar email
    if (!email.trim()) {
      setEmailError('El correo electrónico es obligatorio');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor ingresa un correo electrónico válido');
      hasError = true;
    }

    // Validar contraseña
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      hasError = true;
    }

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      setConfirmPasswordError('Debes confirmar tu contraseña');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        
        // Si el error es de correo duplicado
        if (data.message && data.message.toLowerCase().includes('correo')) {
          setEmailError(data.message);
        } else if (data.message && data.message.toLowerCase().includes('contraseñ')) {
          setPasswordError(data.message);
        } else {
          setEmailError(data.message || 'Error al registrar usuario');
        }
        return;
      }

      // Guardar el token temporalmente (aún no verificado)
      await AsyncStorage.setItem('tempToken', data.data.token);
      await AsyncStorage.setItem('userEmail', email.trim().toLowerCase());

      setIsLoading(false);

      // Redirigir directamente a la pantalla de verificación
      router.replace({
        pathname: '/verify',
        params: { email: email.trim().toLowerCase() },
      });
    } catch (error: any) {
      setIsLoading(false);
      setEmailError('No se pudo conectar con el servidor');
    }
  };

  const handleLogin = () => {
    router.back();
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
              <Text style={styles.welcomeText}>Crea tu cuenta</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Nombre Completo */}
              <Text style={styles.label}>Nombre Completo</Text>
              <View style={[styles.inputContainer, fullNameError && styles.inputContainerError]}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor={Colors.text.placeholder}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setFullNameError('');
                  }}
                  autoCapitalize="words"
                  autoComplete="name"
                  editable={!isLoading}
                />
              </View>
              {fullNameError ? <Text style={styles.errorText}>{fullNameError}</Text> : null}

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputContainer, emailError && styles.inputContainerError]}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu correo electrónico"
                  placeholderTextColor={Colors.text.placeholder}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Te enviaremos un código de verificación a este correo.
                </Text>
              )}

              {/* Contraseña */}
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputContainer, passwordError && styles.inputContainerError]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Crea una contraseña"
                  placeholderTextColor={Colors.text.placeholder}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

              {/* Confirmar Contraseña */}
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={[styles.inputContainer, confirmPasswordError && styles.inputContainerError]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.text.placeholder}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor={Colors.text.placeholder}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

              {/* Términos y Condiciones */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Al registrarte, aceptas nuestros{' '}
                  <Text style={styles.termsLink}>Términos de Servicio</Text> y{' '}
                  <Text style={styles.termsLink}>Política de Privacidad</Text>.
                </Text>
              </View>

              {/* Botón de Registro */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>Registrarse</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Inicia sesión</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  form: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  inputContainerError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.primary,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    marginBottom: 8,
    marginTop: 4,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  loginText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
});
