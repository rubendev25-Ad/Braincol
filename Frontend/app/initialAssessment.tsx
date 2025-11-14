import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

interface Question {
  id: string;
  title: string;
  options: Option[];
}

interface Option {
  id: string;
  label: string;
  value: string;
}

const questions: Question[] = [
  {
    id: 'emotional_wellbeing',
    title: 'Bienestar Emocional',
    options: [
      { id: 'calm', label: 'Me siento tranquilo/a y en control', value: 'calm' },
      { id: 'anxious', label: 'Me siento un poco ansioso/a o preocupado/a', value: 'anxious' },
      { id: 'stressed', label: 'Me siento bastante estresado/a o abrumado/a', value: 'stressed' },
    ],
  },
  {
    id: 'stress_level',
    title: 'Nivel de Estrés',
    options: [
      { id: 'low', label: 'Bajo', value: 'low' },
      { id: 'moderate', label: 'Moderado', value: 'moderate' },
      { id: 'high', label: 'Alto', value: 'high' },
    ],
  },
  {
    id: 'support_resources',
    title: 'Recursos de Apoyo',
    options: [
      { id: 'family', label: 'Familiares y amigos', value: 'family' },
      { id: 'groups', label: 'Grupos de apoyo', value: 'groups' },
      { id: 'professionals', label: 'Profesionales de la salud', value: 'professionals' },
      { id: 'none', label: 'Ninguno', value: 'none' },
    ],
  },
];

export default function InitialAssessmentScreen() {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadUserData();
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUserName(userData.fullName || 'Usuario');
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  const handleSelectOption = (questionId: string, optionValue: string) => {
    setAnswers({
      ...answers,
      [questionId]: optionValue,
    });
  };

  const handleContinue = async () => {
    // Validar que todas las preguntas fueron respondidas
    const allAnswered = questions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      Alert.alert('Atención', 'Por favor responde todas las preguntas para continuar');
      return;
    }

    await submitAssessment();
  };

  const submitAssessment = async () => {
    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const response = await fetch(`${API_URL}/api/assessment/initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers,
          completedAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo guardar la evaluación');
      }

      // Guardar que completó la evaluación inicial
      await AsyncStorage.setItem('assessmentCompleted', 'true');

      setIsLoading(false);

      // Animación de salida suave
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Redirigir al dashboard después de la animación
        router.replace('/(tabs)');
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo guardar la evaluación');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Evaluación Inicial</Text>
      </View>

      <Animated.ScrollView 
        style={[
          styles.scrollView,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Cuidar también es cuidarse 💜</Text>
          <Text style={styles.welcomeDescription}>
            Hola, {userName}. Antes de comenzar, queremos conocerte mejor y 
            entender cómo te sientes. Tus respuestas nos ayudarán a brindarte 
            el apoyo adecuado.
          </Text>
        </View>

        {/* All Questions */}
        <View style={styles.questionsContainer}>
          {questions.map((question, qIndex) => (
            <View key={question.id} style={styles.questionSection}>
              <Text style={styles.questionTitle}>{question.title}</Text>
              
              <View style={styles.optionsContainer}>
                {question.options.map((option) => {
                  const isSelected = answers[question.id] === option.value;
                  
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionCard,
                        isSelected && styles.optionCardSelected,
                      ]}
                      onPress={() => handleSelectOption(question.id, option.value)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionContent}>
                        <View style={[
                          styles.radio,
                          isSelected && styles.radioSelected,
                        ]}>
                          {isSelected && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Text style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}>
                          {option.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            isLoading && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.continueButtonText}>Continuar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F7F9FA',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#A6A8F0',
    marginBottom: 8,
    lineHeight: 32,
  },
  welcomeDescription: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#707B8C',
    lineHeight: 24,
  },
  questionsContainer: {
    gap: 32,
  },
  questionSection: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(92, 107, 192, 0.2)',
  },
  optionCardSelected: {
    borderColor: '#5C6BC0',
    backgroundColor: '#5C6BC0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(92, 107, 192, 0.4)',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: 'transparent',
    backgroundColor: '#5C6BC0',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    lineHeight: 20,
  },
  optionTextSelected: {
    color: Colors.white,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: '#F7F9FA',
  },
  continueButton: {
    backgroundColor: '#5C6BC0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.24,
  },
});
