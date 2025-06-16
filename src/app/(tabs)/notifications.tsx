import { Colors } from '@/constants/Colors'
import { useNotifications } from '@/hooks/useNotifications'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { Stack } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const NotificationsScreen = () => {
  const { notifications, isLoading, error } = useNotifications();
  const headerHeight = useHeaderHeight();

  if (isLoading) {
    return (
      <View style={[styles.container, { marginTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { marginTop: headerHeight, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Error loading notifications</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        headerShown: true,
        headerTransparent: true,
      }} />
      <View style={[styles.container, { marginTop: headerHeight }]}>
        <FlatList
          data={notifications}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animated.View
              style={styles.notificationsWrapper}
              entering={FadeInDown.delay(300 + index * 100).duration(500)}
            >
              <View style={styles.notificationIcon}>
                <Ionicons 
                  name={item.transactionType === 'EarnedPoints' ? "arrow-up-circle-outline" : "arrow-down-circle-outline"} 
                  size={20} 
                  color={item.transactionType === 'EarnedPoints' ? Colors.success : Colors.primary} 
                />
              </View>
              <View style={styles.notificationInfo}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Text style={styles.notificationTitle}>
                    {item.transactionType === 'EarnedPoints' ? 'Points Earned' : 'Points Redeemed'}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {new Date(item.createdOn).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.notificationMessage}>
                  {item.points} points at {item.outletAddress}
                </Text>
                <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
              </View>
            </Animated.View>
          )}
        />
      </View>
    </>
  )
}

export default NotificationsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.extraLightGray,
    borderRadius: 5,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
  },
  notificationMessage: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 5,
    lineHeight: 20,
  },
  orderNumber: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  }
});