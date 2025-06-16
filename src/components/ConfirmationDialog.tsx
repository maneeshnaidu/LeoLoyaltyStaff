import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationDialogProps {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmationDialog({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}: ConfirmationDialogProps) {
    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <View style={styles.header}>
                        <Ionicons name="information-circle" size={24} color={Colors.primary} />
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelButtonText}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.confirmButton]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialog: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: Colors.black,
    },
    message: {
        fontSize: 16,
        color: Colors.gray,
        marginBottom: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.black,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    cancelButtonText: {
        color: Colors.gray,
        fontSize: 16,
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
}); 