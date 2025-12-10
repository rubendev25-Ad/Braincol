import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

interface UserData {
  nombre?: string;
  email?: string;
  profileImage?: string;
}

export default function BienestarScreen() {
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={Colors.azulNeuro} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bienestar</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content - Scrollable */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={
                userData.profileImage 
                  ? { uri: userData.profileImage }
                  : require('../../assets/img/defaultUser.png')
              }
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userData.nombre || 'Usuario'}
            </Text>
            <Text style={styles.profileRole}>Cuidadora</Text>
          </View>
        </View>

        {/* Rutinas de Autocuidado Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rutinas de Autocuidado</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            <TouchableOpacity style={styles.routineCard}>
              <View style={styles.routineImageContainer}>
                <Image 
                  source={require('../../assets/img/meditacion.png')}
                  style={styles.routineImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.routineText}>Meditación Guiada</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.routineCard}>
              <View style={styles.routineImageContainer}>
                <Image 
                  source={require('../../assets/img/respiracion.png')}
                  style={styles.routineImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.routineText}>Ejercicios de Respiración</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Diario Personal Section */}
        <View style={styles.diarySection}>
          <Text style={styles.sectionTitle}>Diario Personal</Text>
          <TouchableOpacity style={styles.diaryCard} activeOpacity={0.95}>
            <Image 
              source={require('../../assets/img/escribir.png')}
              style={styles.diaryBackground}
              resizeMode="cover"
            />
            <View style={styles.diaryOverlay} />
            <View style={styles.diaryContent}>
              <View style={styles.diaryTextContainer}>
                <Text style={styles.diaryTitle}>Registra tus emociones</Text>
                <Text style={styles.diarySubtitle}>Escribe sobre tu día y reflexiona.</Text>
              </View>
              <View style={styles.writeButton}>
                <Text style={styles.writeButtonText}>Escribir</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blancoNube,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.blancoNube,
  },
  menuButton: {
    padding: 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: Colors.azulNeuro,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  profileImageContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    backgroundColor: '#D1D5DB',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.azulNeuro,
  },
  profileRole: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.grisPerla,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: Colors.azulNeuro,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  horizontalScroll: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  routineCard: {
    width: 180,
    gap: 8,
    marginRight: 32,
  },
  routineImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#D1D5DB',
  },
  routineImage: {
    width: '100%',
    height: '100%',
  },
  routineText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.azulNeuro,
    lineHeight: 20,
  },
  diarySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  diaryCard: {
    minHeight: 220,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  diaryBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  diaryOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  diaryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
    minHeight: 220,
  },
  diaryTextContainer: {
    flex: 1,
  },
  diaryTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  diarySubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.white,
  },
  writeButton: {
    backgroundColor: Colors.azulNeuro,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
});
