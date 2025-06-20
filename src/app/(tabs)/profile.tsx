import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('../');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No user data available</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color={Colors.primary} />
                </View>
                <Text style={styles.name}>{user.firstName + ' ' + user.lastName || 'User'}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoRow}>
                        <Ionicons name="mail-outline" size={24} color={Colors.primary} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user.email}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="person-outline" size={24} color={Colors.primary} />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>Name</Text>
                            <Text style={styles.infoValue}>{user.firstName + ' ' + user.lastName || 'Not set'}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <TouchableOpacity style={styles.preferenceItem}>
                    <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
                    <Text style={styles.preferenceText}>Notification Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.preferenceItem}>
                    <Ionicons name="lock-closed-outline" size={24} color={Colors.primary} />
                    <Text style={styles.preferenceText}>Privacy Settings</Text>
                    <Ionicons name="chevron-forward" size={24} color={Colors.gray} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={Colors.white} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: Colors.gray,
    },
    section: {
        marginTop: 20,
        backgroundColor: Colors.white,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 16,
    },
    infoContainer: {
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.gray,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: Colors.black,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    preferenceText: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.error,
        margin: 20,
        padding: 16,
        borderRadius: 8,
        gap: 8,
    },
    logoutText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: Colors.error,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
}); 