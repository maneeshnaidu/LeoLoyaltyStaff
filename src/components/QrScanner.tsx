import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QrScannerProps {
  visible: boolean;
  onScanned: (data: string) => void;
  onClose: () => void;
  scanMode?: string;
}

export const QrScanner: React.FC<QrScannerProps> = ({ visible, onScanned, onClose, scanMode }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const lastScannedCode = useRef<string | null>(null);
  const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
    return () => {
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
    };
  }, [visible]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (data === lastScannedCode.current) return;
    if (scanTimeout.current) clearTimeout(scanTimeout.current);
    scanTimeout.current = setTimeout(() => {
      lastScannedCode.current = null;
    }, 2000);
    lastScannedCode.current = data;
    onScanned(data);
  };

  if (hasPermission === false) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.permissionText}>Camera permission is required to scan QR codes.</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
            <Text style={styles.scanText}>
              {scanMode === 'points' ? 'Scan to Add Points' : scanMode === 'rewards' ? 'Scan to Redeem Rewards' : 'Scan QR Code'}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color={Colors.white} />
          </TouchableOpacity>
        </CameraView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.background,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  scanText: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    padding: 10,
    zIndex: 1100,
  },
  permissionText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
}); 