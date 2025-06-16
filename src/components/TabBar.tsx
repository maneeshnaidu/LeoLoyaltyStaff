import { Colors } from '@/constants/Colors';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import TabBarButton from './TabBarButton';

type RouteName = 'index' | 'explore' | 'scan' | 'notifications' | 'profile';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const [dimensions, setDimensions] = useState({ width: 100, height: 20 });

    const buttonWidth = dimensions.width / state.routes.length;

    useEffect(() => {
        tabPositionX.value = withTiming(state.index * buttonWidth, {
            duration: 200
        });
    }, [state.index]);

    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
        });
    };

    const tabPositionX = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionX.value }],
            position: 'absolute',
            backgroundColor: Colors.primary,
            top: 0,
            left: 20,
            height: 2,
            width: buttonWidth / 2,
        };
    });

    return (
        <View onLayout={onTabBarLayout} style={styles.tabBar}>
            <Animated.View style={animatedStyle} />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    typeof options.tabBarLabel === 'string'
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarButton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name as RouteName}
                        label={label}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        paddingTop: 16,
        paddingBottom: 40,
        backgroundColor: Colors.white,
    },
});

