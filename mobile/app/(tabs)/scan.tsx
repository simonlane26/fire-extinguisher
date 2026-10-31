import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/useTheme';
import { spacing, radius, fontSize, fontWeight } from '../../src/theme/tokens';
import { getExtinguisherByQr } from '../../src/api/extinguishers';

export default function ScanScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const styles = makeStyles(colors);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionText}>
          FireXCheck needs camera access to scan QR codes on your fire safety equipment.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleBarCodeScanned({ data }: { data: string }) {
    if (scanned) return;
    setScanned(true);

    try {
      const extinguisher = await getExtinguisherByQr(data);
      router.push(`/inspect/${extinguisher.id}`);
    } catch {
      Alert.alert(
        'Not found',
        'This QR code is not linked to any equipment. Check it belongs to this site.',
        [{ text: 'Scan Again', onPress: () => setScanned(false) }],
      );
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Viewfinder overlay */}
        <View style={styles.overlay}>
          <View style={styles.overlayTop} />
          <View style={styles.overlayMiddle}>
            <View style={styles.overlaySide} />
            <View style={styles.viewfinder}>
              {/* Corner markers */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <View style={styles.overlaySide} />
          </View>
          <View style={styles.overlayBottom}>
            <Text style={styles.instruction}>
              Point your camera at an equipment QR code
            </Text>
            {scanned && (
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.rescanText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const VIEWFINDER_SIZE = 250;

function makeStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      flex: 1,
    },
    overlayTop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    overlayMiddle: {
      flexDirection: 'row',
    },
    overlaySide: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    viewfinder: {
      width: VIEWFINDER_SIZE,
      height: VIEWFINDER_SIZE,
    },
    corner: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderColor: colors.accent,
    },
    cornerTL: {
      top: 0,
      left: 0,
      borderTopWidth: 3,
      borderLeftWidth: 3,
      borderTopLeftRadius: 4,
    },
    cornerTR: {
      top: 0,
      right: 0,
      borderTopWidth: 3,
      borderRightWidth: 3,
      borderTopRightRadius: 4,
    },
    cornerBL: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 3,
      borderLeftWidth: 3,
      borderBottomLeftRadius: 4,
    },
    cornerBR: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 3,
      borderRightWidth: 3,
      borderBottomRightRadius: 4,
    },
    overlayBottom: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      paddingTop: spacing['2xl'],
    },
    instruction: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      textAlign: 'center',
    },
    rescanButton: {
      marginTop: spacing.lg,
      backgroundColor: colors.accent,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
    },
    rescanText: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
    // Permission screen
    permissionContainer: {
      flex: 1,
      backgroundColor: colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing['3xl'],
    },
    permissionIcon: {
      fontSize: 48,
      marginBottom: spacing.xl,
    },
    permissionTitle: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semibold,
      color: colors.fg,
      marginBottom: spacing.sm,
    },
    permissionText: {
      fontSize: fontSize.md,
      color: colors.fgSecondary,
      textAlign: 'center',
      marginBottom: spacing['2xl'],
      lineHeight: 22,
    },
    permissionButton: {
      backgroundColor: colors.accent,
      paddingHorizontal: spacing['2xl'],
      paddingVertical: 14,
      borderRadius: radius.md,
    },
    permissionButtonText: {
      color: '#FFFFFF',
      fontSize: fontSize.md,
      fontWeight: fontWeight.semibold,
    },
  });
}
