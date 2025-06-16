import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface IconProps {
    color: string;
}

type RouteName = 'index' | 'explore' | 'scan' | 'notifications' | 'profile';

export const icon: Record<RouteName, (props: IconProps) => React.ReactElement> = {
    index: ({ color }: IconProps) => (
        <Ionicons name="home-outline" size={22} color={color} />
    ),
    explore: ({ color }: IconProps) => (
        <Ionicons name="search-outline" size={22} color={color} />
    ),
    scan: ({ color }: IconProps) => (
        <Ionicons name="qr-code-outline" size={22} color={color} />
    ),
    notifications: ({ color }: IconProps) => (
        <Ionicons name="notifications-outline" size={22} color={color} />
    ),
    profile: ({ color }: IconProps) => (
        <Ionicons name="person-outline" size={22} color={color} />
    ),
};