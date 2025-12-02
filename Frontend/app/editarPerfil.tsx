import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// Detectar plataforma y usar la URL correcta
const getApiUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  } else {
    return 'http://192.168.1.100:3000/api';
  }
};

const API_URL = getApiUrl();

export default function EditarPerfilScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    foto_perfil: '',
  });

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const user = JSON.parse(userDataStr);
        setUserData(user);
        setFormData({
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          correo: user.correo || '',
          telefono: user.telefono || '',
          direccion: user.direccion || '',
        });
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso denegado', 'Necesitas dar permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      // Aquí deberías subir la imagen al servidor
      Alert.alert('Próximamente', 'La función de cambiar foto estará disponible pronto');
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.correo) {
      Alert.alert('Campos incompletos', 'El nombre y correo son obligatorios');
      return;
    }

    setSaving(true);
    try {
      // Obtener token de autenticación
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró sesión activa');
        router.replace('/login');
        return;
      }

      // Llamar al backend para actualizar perfil
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          direccion: formData.direccion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'No se pudo actualizar el perfil');
        setSaving(false);
        return;
      }

      // Actualizar AsyncStorage con los nuevos datos
      const updatedUser = {
        ...userData,
        ...data.data.user,
      };
      
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleChangePassword = () => {
    router.push('/cambiarPassword');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5C6BC0" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#707B8C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                {userData.foto_perfil ? (
                  <Image 
                    source={{ uri: userData.foto_perfil }}
                    style={styles.avatar}
                  />
                ) : (
                  <Image 
                    source={require('../assets/img/defaultUser.png')}
                    style={styles.avatar}
                  />
                )}
              </View>
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={handlePickImage}
              >
                <Ionicons name="create" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {formData.nombre} {formData.apellido}
            </Text>
            <Text style={styles.userEmail}>{formData.correo}</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              />
            </View>

            {/* Apellido */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Apellido</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu apellido"
                value={formData.apellido}
                onChangeText={(text) => setFormData({ ...formData, apellido: text })}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                value={formData.correo}
                onChangeText={(text) => setFormData({ ...formData, correo: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value="••••••••"
                  editable={false}
                />
                <TouchableOpacity 
                  style={styles.changePasswordButton}
                  onPress={handleChangePassword}
                >
                  <Text style={styles.changePasswordText}>Cambiar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Teléfono */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Número de Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder="+XX XXX-XXX-XXXX"
                value={formData.telefono}
                onChangeText={(text) => {
                  // Solo permitir números, espacios, guiones y el símbolo +
                  const cleaned = text.replace(/[^\d\s\-+]/g, '');
                  setFormData({ ...formData, telefono: cleaned });
                }}
                keyboardType="phone-pad"
              />
            </View>

            {/* Dirección */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dirección</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu dirección completa"
                value={formData.direccion}
                onChangeText={(text) => setFormData({ ...formData, direccion: text })}
              />
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F7F9FA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#131117',
    fontFamily: 'Poppins-Bold',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'white',
    backgroundColor: '#E5E7EB',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#5C6BC0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#131117',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#707B8C',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 16,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#707B8C',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#131117',
    fontFamily: 'Poppins-Regular',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 80,
  },
  changePasswordButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changePasswordText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5C6BC0',
    fontFamily: 'Poppins-Bold',
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#5C6BC0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C6BC0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#5C6BC0',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
});
