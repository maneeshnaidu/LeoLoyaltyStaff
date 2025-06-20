import { Colors } from '@/constants/Colors';
import { useAddPoints } from '@/hooks/useAddPoints';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConfirmationDialog } from './ConfirmationDialog';
import { QrScanner } from './QrScanner';
import { Toast } from './Toast';

interface AddPointsProps {
  user: any; // Replace with your user type if available
}

export const AddPoints: React.FC<AddPointsProps> = ({ user }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanConfirmation, setScanConfirmation] = useState<{ visible: boolean; userCode: number | null }>({ visible: false, userCode: null });
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });
  const addPointsMutation = useAddPoints();

  const handleQrScanned = (data: string) => {
    const userCode = parseInt(data);
    if (isNaN(userCode)) {
      setToast({ visible: true, message: 'Invalid user code', type: 'error' });
      setScannerVisible(false);
      return;
    }
    setScanConfirmation({ visible: true, userCode });
    setScannerVisible(false);
  };

  const handleConfirm = async () => {
    if (!scanConfirmation.userCode) return;
    try {
      await addPointsMutation.mutateAsync({
        customerCode: scanConfirmation.userCode,
        data: {
          customerCode: scanConfirmation.userCode,
          rewardId: 1, // Example reward ID
          vendorId: user?.vendor ?? 0,
          outletId: user?.vendor ?? 0,
          orderId: 0,
          point: 1,
        },
      });
      setToast({ visible: true, message: 'Points added successfully', type: 'success' });
    } catch {
      setToast({ visible: true, message: 'Failed to add points', type: 'error' });
    } finally {
      setScanConfirmation({ visible: false, userCode: null });
    }
  };

  return (
    <>
      <QrScanner
        visible={scannerVisible}
        scanMode="points"
        onScanned={handleQrScanned}
        onClose={() => setScannerVisible(false)}
      />
      <ConfirmationDialog
        visible={scanConfirmation.visible}
        title="Add Points"
        message={`Are you sure you want to add points for user code ${scanConfirmation.userCode}?`}
        onConfirm={handleConfirm}
        onCancel={() => setScanConfirmation({ visible: false, userCode: null })}
        confirmText="Add Points"
      />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setScannerVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.content}>
          <Ionicons name="add-circle-outline" size={44} color={Colors.white} style={styles.icon} />
          <Text style={styles.buttonText}>Add Points</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    height: 100,
    width: '100%',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  icon: {
    marginRight: 18,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1,
  },
});