import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ResultDetail() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: true, title: 'Dettaglio Risultato', headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/')}>
                   <Ionicons name="home" size={24} style={{marginRight: 10}} color="#043474" />
                </TouchableOpacity>
             )}} />
            <Text style={styles.title}>Dettaglio Risultato</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#043474',
    },
});