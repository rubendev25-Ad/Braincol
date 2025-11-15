import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
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

export default function VerifyScreen() {
  const params = useLocalSearchParams();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadEmail();
  }, []);

  const loadEmail = async () => {
    const emailParam = params.email as string;
    const storedEmail = await AsyncStorage.getItem('userEmail');
    setEmail(emailParam || storedEmail || '');
  };

  const handleCodeChange = (text: string, index: number) => {
    // Solo permitir números
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus al siguiente input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verificar cuando se complete el código
    if (index === 5 && text) {
      const fullCode = [...newCode];
      fullCode[5] = text;
      if (fullCode.every(digit => digit !== '')) {
        setTimeout(() => handleVerify(fullCode.join('')), 300);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Manejar backspace para ir al input anterior
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (verificationCode?: string) => {
    const codeToVerify = verificationCode || code.join('');
    
    if (codeToVerify.length !== 6) {
      Alert.alert('Error', 'Por favor ingresa el código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: codeToVerify,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código de verificación inválido');
      }

      // Guardar el token y datos del usuario
      await AsyncStorage.setItem('authToken', data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
      await AsyncStorage.removeItem('tempToken');
      await AsyncStorage.removeItem('userEmail');

      // Pequeña pausa para mostrar éxito visual
      setIsLoading(false);
      
      // Animación de éxito con el input
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Esperar un momento antes de la transición
      setTimeout(() => {
        // Animación de salida suave
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Redirigir a la evaluación inicial después de la animación
          router.replace('/initialAssessment');
        });
      }, 800);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo verificar el código');
      // Limpiar el código si es inválido
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Error', 'No se pudo obtener tu email');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo reenviar el código');
      }

      Alert.alert(
        'Código Reenviado ✅',
        'Hemos enviado un nuevo código de verificación a tu correo electrónico.',
      );
      
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo reenviar el código');
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={48} color={Colors.primary} />
            </View>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Verifica tu cuenta</Text>
            <Text style={styles.description}>
              Hemos enviado un código de 6 dígitos a{' '}
              <Text style={styles.emailText}>{email}</Text>. Por favor, ingrésalo
              a continuación para continuar.
            </Text>
          </View>

          {/* Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                autoFocus={index === 0}
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isCodeComplete || isLoading) && styles.verifyButtonDisabled,
            ]}
            onPress={() => handleVerify()}
            disabled={!isCodeComplete || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.verifyButtonText}>Verificar</Text>
            )}
          </TouchableOpacity>

          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código? </Text>
            <TouchableOpacity onPress={handleResend} disabled={isResending || isLoading}>
              {isResending ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.resendLink}>Reenviar</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              El código expirará en 15 minutos. Revisa tu bandeja de entrada y spam.
            </Text>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.text.primary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  emailText: {
    color: Colors.text.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 4,
  },
  codeInput: {
    flex: 1,
    maxWidth: 50,
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0.5,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  resendText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
  },
  resendLink: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'Poppins-SemiBold',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8EEFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text.secondary,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
  },
});
