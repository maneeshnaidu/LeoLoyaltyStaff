import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onHide: () => void;
}

export function Toast({
    visible,
    message,
    type = 'info',
    duration = 3000,
    onHide,
}: ToastProps) {
    const opacity = new Animated.Value(0);

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(duration),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide();
            });
        }
    }, [visible, duration, onHide]);

    if (!visible) return null;

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            default:
                return 'information-circle';
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return Colors.success;
            case 'error':
                return Colors.error;
            default:
                return Colors.primary;
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity,
                    backgroundColor: getBackgroundColor(),
                },
            ]}
        >
            <Ionicons name={getIconName()} size={24} color={Colors.white} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: Colors.white,
        fontSize: 16,
        marginLeft: 12,
        flex: 1,
    },
}); 