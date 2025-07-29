import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

export default function Terms() {
    const router = useRouter();
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: true, headerStyle: {
                backgroundColor: '#28338a',
            }, title: 'Termini e Condizioni', 
            headerLeft: () => (
                    <TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => navigation.openDrawer()}>
                      <Ionicons name="menu" size={30} color="#dbe7f2" />
                    </TouchableOpacity>
                  ),
            headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/')}>
                   <Ionicons name="home" size={24} style={{marginRight: 10}} color="#dbe7f2" />
                </TouchableOpacity>
             ), headerTitleStyle: {
                color: '#dbe7f2',
                fontWeight: '600',
            }, }} />
            <Text style={styles.title}>Termini e Condizioni</Text>
        </View>
    );
};

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
