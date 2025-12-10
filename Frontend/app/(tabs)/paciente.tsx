import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/Colors';

export default function PacienteScreen() {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const handleActivateCamera = async () => {
    if (!hasPermission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          'Permiso de cámara',
          'Necesitamos acceso a la cámara para escanear el código QR.'
        );
        return;
      }
    }
    setCameraActive(true);
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setCameraActive(false);
    Alert.alert(
      'Código QR escaneado',
      `Tipo: ${type}\nDatos: ${data}`,
      [
        {
          text: 'Escanear otro',
          onPress: () => {
            setScanned(false);
            setCameraActive(true);
          }
        },
        { text: 'OK', onPress: () => setScanned(false) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Main Content - Flex Grow */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={Colors.grisPerla} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emparejar dispositivo</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Content Area - Centered */}
        <View style={styles.contentWrapper}>
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Escanea el código QR</Text>
              <Text style={styles.description}>
                Apunta la cámara de tu dispositivo al código QR que se muestra en el dispositivo del paciente.
              </Text>
            </View>

            {/* QR Scanner Area */}
            <View style={styles.scannerContainer}>
              {cameraActive && hasPermission?.granted ? (
                <CameraView
                  style={styles.camera}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                  }}
                >
                  <View style={styles.overlay}>
                    <View style={styles.scanFrame}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                  </View>
                </CameraView>
              ) : (
                <View style={styles.placeholderCamera}>
                  <Image 
                    source={require('../../assets/img/QR.png')} 
                    style={styles.qrImage}
                    resizeMode="cover"
                  />
                  <View style={styles.overlayPlaceholder}>
                    <View style={styles.scanFrame}>
                      <View style={[styles.corner, styles.topLeft]} />
                      <View style={[styles.corner, styles.topRight]} />
                      <View style={[styles.corner, styles.bottomLeft]} />
                      <View style={[styles.corner, styles.bottomRight]} />
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Activate Camera Button */}
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={handleActivateCamera}
              activeOpacity={0.9}
            >
              <Text style={styles.activateButtonText}>Activar cámara</Text>
            </TouchableOpacity>

            {/* Privacy Note */}
            <Text style={styles.privacyNote}>
              Tu privacidad es importante. Los datos se comparten de forma segura.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blancoNube,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    paddingRight: 32,
  },
  headerSpacer: {
    width: 28,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.grisPerla,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 384,
    lineHeight: 20,
  },
  scannerContainer: {
    width: '100%',
    maxWidth: 384,
    aspectRatio: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: 32,
    backgroundColor: '#D1D5DB',
  },
  camera: {
    flex: 1,
  },
  placeholderCamera: {
    flex: 1,
    position: 'relative',
  },
  qrImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlayPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: '75%',
    aspectRatio: 1,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderColor: Colors.blancoNube,
    borderWidth: 4,
  },
  topLeft: {
    top: -4,
    left: -4,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -4,
    right: -4,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -4,
    left: -4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -4,
    right: -4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  activateButton: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: Colors.azulNeuro,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  activateButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
  privacyNote: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.grisPerla,
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
