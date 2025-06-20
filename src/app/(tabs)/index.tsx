import { AddPoints } from '@/components/AddPoints';
import { RedeemPoints } from '@/components/RedeemPoints';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
    const { user } = useAuthStore();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome, {user?.firstName}</Text>
                <Text style={styles.subtitle}>What would you like to do?</Text>
            </View>
            <View style={styles.actionsContainer}>
                <AddPoints user={user} />
                <RedeemPoints user={user} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.gray,
    },
    actionsContainer: {
        padding: 20,
        gap: 20,
    },
});
