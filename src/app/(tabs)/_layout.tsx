import React from 'react';
import { Tabs } from "expo-router";
import { TabBar } from '@/components/TabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                headerShown: true,
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    href: '/',
                }}
            />
            <Tabs.Screen
                name='notifications'
                options={{
                    title: 'Notification',
                    href: '/notifications',
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    href: '/profile',
                }}
            />
        </Tabs>
    );
}