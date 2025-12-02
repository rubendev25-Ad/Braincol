import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen() {
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        const firstName = userData.nombre || userData.fullName?.split(' ')[0] || 'Usuario';
        setUserName(firstName);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Brainsure Cuidadores</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require('../../assets/img/defaultUser.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>Hola, {userName}</Text>
            <Text style={styles.subGreeting}>Qué bueno verte de nuevo.</Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Luz María</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Estado Cognitivo</Text>
              <Text style={[styles.summaryValue, { color: '#5C6BC0' }]}>Estable</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Bienestar</Text>
              <Text style={[styles.summaryValue, { color: '#B3D4FF' }]}>Bueno</Text>
            </View>
          </View>
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividades Pendientes</Text>
          <View style={styles.activitiesList}>
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons name="fitness" size={24} color="#5C6BC0" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Ejercicio de memoria</Text>
                <Text style={styles.activityTime}>10:00 AM</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Ionicons name="leaf" size={24} color="#5C6BC0" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Paseo al parque</Text>
                <Text style={styles.activityTime}>2:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acceso Rápido</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity style={styles.quickAccessButton}>
              <Text style={styles.quickAccessButtonText}>Bienestar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickAccessButton, styles.quickAccessButtonSecondary]}>
              <Text style={[styles.quickAccessButtonText, styles.quickAccessButtonTextSecondary]}>
                Círculo de Cuidado
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'rgba(247, 249, 250, 0.8)',
  },
  headerSpacer: {
    width: 48,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#707B8C',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#707B8C',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(92, 107, 192, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#707B8C',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAccessButton: {
    flex: 1,
    backgroundColor: '#5C6BC0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessButtonSecondary: {
    backgroundColor: '#A6A8F0',
  },
  quickAccessButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  quickAccessButtonTextSecondary: {
    color: '#5C6BC0',
  },
});
