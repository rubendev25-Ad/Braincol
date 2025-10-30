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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    console.log('Register:', { fullName, email, password, confirmPassword });
    // Validaciones y lógica de registro
    router.push('/verify');
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
              <View style={styles.inputContainer}>
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
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
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
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              <Text style={styles.helperText}>
                Te enviaremos un código de verificación a este correo.
              </Text>

              {/* Contraseña */}
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.inputContainer}>
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
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirmar Contraseña */}
              <Text style={styles.label}>Confirmar Contraseña</Text>
              <View style={styles.inputContainer}>
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
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={Colors.text.placeholder}
                  />
                </TouchableOpacity>
              </View>

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
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>Registrarse</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={handleLogin}>
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
