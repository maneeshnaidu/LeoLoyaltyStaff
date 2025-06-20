import { RewardType } from '@/types';
import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RewardListModalProps {
  visible: boolean;
  rewards?: RewardType[];
  onSelect: (rewardId: number) => void;
  onCancel: () => void;
}

export const RewardListModal: React.FC<RewardListModalProps> = ({
  visible,
  rewards = [],
  onSelect,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select a Reward to Redeem</Text>
          <FlatList
            data={rewards}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.rewardItem}
                onPress={() => onSelect(item.id)}
              >
                <Text style={styles.rewardName}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.rewardDesc}>{item.description}</Text>
                )}
                {item.pointsRequired !== undefined && (
                  <Text style={styles.rewardPoints}>
                    Points: {item.pointsRequired}
                  </Text>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No rewards available.</Text>
            }
          />
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  rewardPoints: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  cancelButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#d00',
    fontSize: 16,
  },
});