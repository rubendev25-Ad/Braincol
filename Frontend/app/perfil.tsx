import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              // Limpiar datos de sesión
              await AsyncStorage.multiRemove([
                'authToken',
                'userData',
                'tempToken',
                'userEmail',
                'assessmentCompleted'
              ]);
              
              // Redirigir al login
              router.replace('/login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Implementar edición de perfil
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handleNotifications = () => {
    // TODO: Implementar notificaciones
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handlePreferences = () => {
    // TODO: Implementar preferencias
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handleFAQ = () => {
    // TODO: Implementar FAQ
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  const handleContact = () => {
    // TODO: Implementar contacto
    Alert.alert('Próximamente', 'Esta función estará disponible pronto');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  // Obtener iniciales del nombre para el avatar
  const getInitials = () => {
    if (!user) return '?';
    const nombre = user.nombre || '';
    const apellido = user.apellido || '';
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  // Formatear el rol
  const getRoleLabel = () => {
    if (!user) return 'Usuario';
    const roleMap = {
      'cuidador': 'Cuidador',
      'admin': 'Administrador',
      'paciente': 'Paciente'
    };
    return roleMap[user.rol] || 'Usuario';
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#707B8C" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Perfil</Text>

        {/* Espaciador para centrar el título */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FOTO + INFO */}
        <View style={styles.profileSection}>
          {/* Avatar con iniciales */}
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>

          <Text style={styles.name}>
            {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
          </Text>
          <Text style={styles.role}>{getRoleLabel()}</Text>
          <Text style={styles.email}>{user?.correo || ''}</Text>
          <Text style={styles.since}>Miembro desde 2024</Text>
        </View>

        {/* CUENTA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>

          <View style={styles.card}>
            <MenuItem 
              icon="person" 
              label="Editar perfil" 
              onPress={handleEditProfile}
            />
            <MenuItem 
              icon="notifications" 
              label="Notificaciones" 
              onPress={handleNotifications}
            />
            <MenuItem 
              icon="settings" 
              label="Preferencias de la app" 
              onPress={handlePreferences}
              last 
            />
          </View>
        </View>

        {/* AYUDA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayuda y soporte</Text>

          <View style={styles.card}>
            <MenuItem 
              icon="help-circle" 
              label="Preguntas frecuentes" 
              onPress={handleFAQ}
            />
            <MenuItem 
              icon="mail" 
              label="Contáctanos" 
              onPress={handleContact}
              last 
            />
          </View>
        </View>

        {/* SESIÓN */}
        <View style={styles.section}>
          <View style={styles.card}>
            <MenuItem 
              icon="log-out" 
              label="Cerrar sesión" 
              onPress={handleLogout}
              danger
              last 
            />
          </View>
        </View>

        {/* Espaciado inferior */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER NAV */}
      <View style={styles.footer}>
        <FooterButton 
          icon="home-outline" 
          label="Inicio" 
          onPress={() => router.push('/(tabs)')}
        />
        <FooterButton 
          icon="person-circle-outline" 
          label="Paciente" 
          onPress={() => router.push('/(tabs)/paciente')}
        />
        <FooterButton 
          icon="heart-outline" 
          label="Bienestar" 
          onPress={() => router.push('/(tabs)/bienestar')}
        />
        <FooterButton 
          icon="people-outline" 
          label="Círculo" 
          onPress={() => router.push('/(tabs)/circulo')}
        />
        <FooterButton 
          icon="person" 
          label="Perfil" 
          active 
        />
      </View>
    </View>
  );
}

/* ------------------- COMPONENTE DE ITEM ------------------- */
const MenuItem = ({ icon, label, last, danger, onPress }) => (
  <TouchableOpacity 
    style={[styles.menuItem, !last && styles.itemBorder]}
    onPress={onPress}
  >
    <View style={[styles.iconBox, danger && styles.dangerIconBox]}>
      <Ionicons 
        name={icon} 
        size={22} 
        color={danger ? "#EF4444" : "#5C6BC0"} 
      />
    </View>

    <Text style={[styles.menuText, danger && styles.dangerText]}>
      {label}
    </Text>

    <Ionicons
      name="chevron-forward"
      size={20}
      color={danger ? "#EF4444" : "rgba(112,123,140,0.5)"}
    />
  </TouchableOpacity>
);

/* ------------------ FOOTER BUTTON ------------------ */

const FooterButton = ({ icon, label, active, onPress }) => (
  <TouchableOpacity 
    style={styles.footerBtn}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={22}
      color={active ? "#5C6BC0" : "#707B8C"}
    />
    <Text
      style={[
        styles.footerLabel,
        active && { color: "#5C6BC0", fontWeight: "600" },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* ---------------------- ESTILOS ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#F7F9FA",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#707B8C",
  },

  profileSection: {
    alignItems: "center",
    padding: 20,
  },

  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#5C6BC0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  avatarText: {
    fontSize: 48,
    fontWeight: "700",
    color: "white",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5C6BC0",
  },

  role: {
    fontSize: 16,
    color: "#707B8C",
    marginTop: 4,
  },

  email: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 2,
  },

  since: {
    fontSize: 14,
    color: "#707B8C",
    marginTop: 8,
  },

  section: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5C6BC0",
    marginBottom: 8,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F7F9FA",
  },

  iconBox: {
    backgroundColor: "rgba(166,168,240,0.3)",
    padding: 8,
    borderRadius: 12,
  },

  dangerIconBox: {
    backgroundColor: "rgba(239,68,68,0.1)",
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#707B8C",
  },

  dangerText: {
    color: "#EF4444",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "white",
  },

  footerBtn: {
    alignItems: "center",
  },

  footerLabel: {
    fontSize: 12,
    color: "#707B8C",
    marginTop: 4,
  },
});

