import { apiClient } from '@/api/client';
import { ConfirmationDialog } from '@/components/ConfirmationDialog';
import { Toast } from '@/components/Toast';
import { Colors } from '@/constants/Colors';
import { useAddPoints } from '@/hooks/usePoints';
import { useAuthStore } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ScanMode = 'points' | 'rewards' | null;

interface ScanConfirmation {
    visible: boolean;
    userCode: number | null;
    mode: ScanMode;
}

export default function HomeScreen() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scanMode, setScanMode] = useState<ScanMode>(null);
    const [scanConfirmation, setScanConfirmation] = useState<ScanConfirmation>({
        visible: false,
        userCode: null,
        mode: null,
    });
    const [toast, setToast] = useState<{
        visible: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        visible: false,
        message: '',
        type: 'info',
    });
    const { user } = useAuthStore();
    const addPointsMutation = useAddPoints();
    const lastScannedCode = useRef<string | null>(null);
    const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const requestCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const handleBarCodeScanned = async ({ data }: { data: string }) => {
        // Prevent multiple scans of the same code within 2 seconds
        if (data === lastScannedCode.current) {
            return;
        }

        // Clear any existing timeout
        if (scanTimeout.current) {
            clearTimeout(scanTimeout.current);
        }

        // Set a new timeout to reset the lastScannedCode after 2 seconds
        scanTimeout.current = setTimeout(() => {
            lastScannedCode.current = null;
        }, 2000);

        lastScannedCode.current = data;

        try {
            if (!data) {
                showToast('Invalid QR code', 'error');
                return;
            }

            const userCode = parseInt(data);
            if (isNaN(userCode)) {
                showToast('Invalid user code', 'error');
                return;
            }

            // Show confirmation dialog instead of processing immediately
            setScanConfirmation({
                visible: true,
                userCode,
                mode: scanMode,
            });

            // Close scanner after successful scan
            setScannerVisible(false);
            setScanMode(null);
        } catch (error) {
            showToast('Failed to process QR code', 'error');
        }
    };

    const handleConfirmScan = async () => {
        if (!scanConfirmation.userCode || !scanConfirmation.mode) return;

        try {
            if (scanConfirmation.mode === 'points') {
                await addPointsMutation.mutateAsync({
                    customerCode: scanConfirmation.userCode,
                    data: {
                        customerCode: scanConfirmation.userCode,
                        rewardId: 1, // Example reward ID
                        vendorId: 1, // Example vendor ID
                        outletId: 1, // Example outlet ID
                        orderId: 1, // Example order ID
                        point: 1, // Example points to add
                    },
                });
                showToast('Points added successfully', 'success');
            } else if (scanConfirmation.mode === 'rewards') {
                await apiClient.post('/rewards/redeem', {
                    userCode: scanConfirmation.userCode,
                    staffId: user?.userCode,
                });
                showToast('Reward redeemed successfully', 'success');
            }
        } catch (error) {
            showToast('Operation failed', 'error');
        } finally {
            setScanConfirmation({ visible: false, userCode: null, mode: null });
        }
    };

    const startScanning = async (mode: ScanMode) => {
        if (hasPermission === null) {
            await requestCameraPermission();
        }
        if (hasPermission === false) {
            Alert.alert('Permission Required', 'Camera permission is required to scan QR codes');
            return;
        }
        setScanMode(mode);
        setScannerVisible(true);
    };

    if (scannerVisible) {
        return (
            <View style={styles.container}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ['qr'],
                    }}
                    onBarcodeScanned={handleBarCodeScanned}
                >
                    <View style={styles.overlay}>
                        <View style={styles.scanArea} />
                        <Text style={styles.scanText}>
                            {scanMode === 'points' ? 'Scan to Add Points' : 'Scan to Redeem Rewards'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            setScannerVisible(false);
                            setScanMode(null);
                        }}
                    >
                        <Ionicons name="close" size={30} color={Colors.white} />
                    </TouchableOpacity>
                </CameraView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome, {user?.firstName}</Text>
                <Text style={styles.subtitle}>What would you like to do?</Text>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                    onPress={() => startScanning('points')}
                >
                    <Ionicons name="add-circle-outline" size={40} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Add Points</Text>
                    <Text style={styles.actionButtonSubtext}>Scan customer QR code to add points</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
                    onPress={() => startScanning('rewards')}
                >
                    <Ionicons name="gift-outline" size={40} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Redeem Rewards</Text>
                    <Text style={styles.actionButtonSubtext}>Scan customer QR code to redeem rewards</Text>
                </TouchableOpacity>
            </View>

            <ConfirmationDialog
                visible={scanConfirmation.visible}
                title={scanConfirmation.mode === 'points' ? 'Add Points' : 'Redeem Reward'}
                message={`Are you sure you want to ${
                    scanConfirmation.mode === 'points' ? 'add points for' : 'redeem reward for'
                } user code ${scanConfirmation.userCode}?`}
                onConfirm={handleConfirmScan}
                onCancel={() => setScanConfirmation({ visible: false, userCode: null, mode: null })}
                confirmText={scanConfirmation.mode === 'points' ? 'Add Points' : 'Redeem'}
            />

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
    },
    actionsContainer: {
        padding: 20,
        gap: 20,
    },
    actionButton: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    actionButtonSubtext: {
        color: Colors.white,
        fontSize: 14,
        opacity: 0.8,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
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
        top: 40,
        right: 20,
        padding: 10,
    },
});
