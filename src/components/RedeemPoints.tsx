import { Colors } from '@/constants/Colors';
import { useGetUserRewards } from '@/hooks/useGetUserRewards';
import { useRedeemPoints } from '@/hooks/useRedeemPoints';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { QrScanner } from './QrScanner';
import { RewardListModal } from './RewardListModal';
import { Toast } from './Toast';

interface RedeemPointsProps {
  user: any; // Replace with your user type if available
}

export const RedeemPoints: React.FC<RedeemPointsProps> = ({ user }) => {
  const [scannerVisible, setScannerVisible] = useState(false);
  const [selectedUserCode, setSelectedUserCode] = useState<number | null>(null);
  const [rewardSelectionVisible, setRewardSelectionVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

  const getUserRewards = useGetUserRewards(user?.vendor, selectedUserCode ?? 0, !!selectedUserCode);
  const redeemPoints = useRedeemPoints();

  const handleQrScanned = (data: string) => {
    const userCode = parseInt(data);
    if (isNaN(userCode)) {
      setToast({ visible: true, message: 'Invalid user code', type: 'error' });
      setScannerVisible(false);
      return;
    }
    setSelectedUserCode(userCode);
    setRewardSelectionVisible(true);
    setScannerVisible(false);
  };

  return (
    <>
      <QrScanner
        visible={scannerVisible}
        scanMode="rewards"
        onScanned={handleQrScanned}
        onClose={() => setScannerVisible(false)}
      />
      <RewardListModal
        visible={rewardSelectionVisible}
        rewards={getUserRewards.data}
        onSelect={async (rewardId: number) => {
          if (selectedUserCode == null) {
            setToast({ visible: true, message: 'No user selected', type: 'error' });
            return;
          }
          try {
            await redeemPoints.mutateAsync({
              customerCode: selectedUserCode,
              data: {
                customerCode: selectedUserCode,
                rewardId,
                vendorId: user?.vendor ?? 0,
                outletId: user?.vendor ?? 0,
                orderId: 0,
                point: 0,
              },
            });
            setToast({ visible: true, message: 'Reward redeemed successfully', type: 'success' });
          } catch {
            setToast({ visible: true, message: 'Failed to redeem reward', type: 'error' });
          } finally {
            setRewardSelectionVisible(false);
            setSelectedUserCode(null);
          }
        }}
        onCancel={() => {
          setRewardSelectionVisible(false);
          setSelectedUserCode(null);
        }}
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
          <Ionicons name="gift-outline" size={44} color={Colors.white} style={styles.icon} />
          <Text style={styles.buttonText}>Redeem Rewards</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
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