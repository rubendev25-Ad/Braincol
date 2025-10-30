import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';

export default function VerifyScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [email] = useState('usuario@email.com'); // Este vendría de la navegación

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
  };

  const handleKeyPress = (e: any, index: number) => {
    // Manejar backspace para ir al input anterior
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    console.log('Verify code:', verificationCode);
    // Lógica de verificación
  };

  const handleResend = () => {
    console.log('Resend code');
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
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
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              !isCodeComplete && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerify}
            disabled={!isCodeComplete}
          >
            <Text style={styles.verifyButtonText}>Verificar</Text>
          </TouchableOpacity>

          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>¿No recibiste el código? </Text>
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Reenviar</Text>
            </TouchableOpacity>
          </View>
        </View>
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
});
