import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useOTPStore } from "@/store/otpStore";
import { useEffect, useState } from 'react';
import Spinner from "@/components/Spinner";
import { Ionicons } from "@expo/vector-icons";
interface Breach {
    Name: string;
    Title: string;
    Domain: string;
    BreachDate: string;
    AddedDate: string;
    ModifiedDate: string;
    PwnCount: number;
    Description: string;
    LogoPath: string;
    DataClasses: string[];
    IsVerified: boolean;
    IsFabricated: boolean;
    IsSensitive: boolean;
    IsRetired: boolean;
    IsSpamList: boolean;
    IsMalware: boolean;
    IsSubscriptionFree: boolean;
    IsStealerLog: boolean;
  }


export default function PreliminarySearchResults() {
    const router = useRouter();
    const { email } = useOTPStore();
    const [breaches, setBreaches] = useState<Breach[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBreaches = async () => {
            if (!email) return;
            
            try {
                setLoading(true);
                const response = await fetch(`https://guardiadigitale.it/api/proxy_hipb.php?email=${encodeURIComponent(email)}`);
                
                if (response.status === 404) {
                    setBreaches([]);
                    return;
                }
                
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei dati di violazione');
                }
                
                const data = await response.json();
                setBreaches(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Si è verificato un errore');
                console.error('Error fetching breach data:', err);
            } finally {
               setLoading(false);
            }
        };

        fetchBreaches();
    }, [email]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ 
                    headerShown: true, 
                    title: 'Caricamento',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#043474" />
                        </TouchableOpacity>
                    )
                }} />
                <View style={styles.centeredContent}>
                    <Spinner />
                    <Text style={styles.loadingText}>Ricerca in corso...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ 
                    headerShown: true, 
                    title: 'Errore',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#043474" />
                        </TouchableOpacity>
                    )
                }} />
                <View style={styles.centeredContent}>
                    <Ionicons name="warning" size={48} color="#e74c3c" style={styles.icon} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }
     if (breaches.length === 0) {
            return (
                <View style={styles.container}>
                    <Stack.Screen options={{ 
                        headerShown: true, 
                        title: 'Nessuna violazione',
                        headerRight: () => (
                            <TouchableOpacity onPress={() => router.push('/')}>
                               <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#043474" />
                            </TouchableOpacity>
                        )
                    }} />
                    <View style={styles.centeredContent}>
                        <Ionicons name="checkmark-circle" size={64} color="#2ecc71" style={styles.icon} />
                        <Text style={styles.successTitle}>Nessuna violazione trovata</Text>
                        <Text style={styles.successText}>Il tuo indirizzo email non è stato coinvolto in violazioni di dati note.</Text>
                    </View>
                </View>
            );
        }

    return (
        <View style={styles.container}>
            <Text>Prima pagina dei risultati</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/(risultati)/SearchResults')}>
                <Text>Prosegui</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        marginTop: 16,
        color: '#043474',
    },
    errorText: {
        fontSize: 16,
        marginTop: 16,
        color: '#e74c3c',
    },
    icon: {
        marginBottom: 16,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#043474',
    },
    successText: {
        fontSize: 16,
        color: '#28338a',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#043474',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
});