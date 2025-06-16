import { Colors } from '@/constants/Colors';
import { icon } from '@/constants/Icons';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

// Define valid route names as a type
type RouteName = 'index' | 'explore' | 'scan' | 'notifications' | 'profile';

type Props = {
    label: string;
    isFocused: boolean;
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
    routeName: RouteName;
};

const TabBarButton = (props: Props) => {
    const { label, isFocused, onPress, onLongPress, routeName } = props;
    return (
        <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
        >
            {routeName === 'notifications' && (
                //Notifications badge
                <View style={styles.badgeWrapper}>
                    <Text style={styles.badgeText}>3</Text>
                </View>
            )}
            {icon[routeName]({
                color: isFocused ? Colors.primary : Colors.black
            })}
            <Text style={{ color: isFocused ? Colors.primary : Colors.gray }}>
                {label}
            </Text>
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    tabBarButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
    badgeWrapper: {
        position: 'absolute',
        backgroundColor: Colors.highlight,
        top: -5,
        right: 20,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 10,
        zIndex: 10,
    },
    badgeText: {
        color: Colors.black,
        fontSize: 12,
    }
})