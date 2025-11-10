import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface CameraScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onBarcodeScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [device, setDevice] = useState<any>(null);
  const [codeScanner, setCodeScanner] = useState<any>(null);

  // Only initialize camera on native platforms
  React.useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const { Camera, useCameraDevice, useCodeScanner } = require('react-native-vision-camera');
        const cameraDevice = useCameraDevice('back');
        const scanner = useCodeScanner({
          codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e', 'code-128'],
          onCodeScanned: (codes: any[]) => {
            if (codes.length > 0 && isScanning) {
              const scannedBarcode = codes[0].value;
              onBarcodeScanned(scannedBarcode);
              setIsScanning(false);
            }
          },
        });
        setDevice(cameraDevice);
        setCodeScanner(scanner);
      } catch (error) {
        console.log('Camera not available:', error);
      }
    }
  }, [isScanning, onBarcodeScanned]);

  if (Platform.OS === 'web' || !device) {
    return null;
  }

  const Camera = require('react-native-vision-camera').Camera;

  return (
    <View style={styles.cameraContainer}>
      {isScanning ? (
        <Camera
          style={styles.camera}
          device={device}
          isActive={isScanning}
          codeScanner={codeScanner}
        />
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderText}>Camera Ready</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => setIsScanning(!isScanning)}
      >
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    height: 200,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#424242',
  },
  cameraPlaceholderText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraScanner;

