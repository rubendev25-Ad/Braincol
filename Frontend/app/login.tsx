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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login:', { email, password });
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
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor={Colors.text.placeholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={Colors.text.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotPasswordButton}
              >
                <Text style={styles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
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
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
