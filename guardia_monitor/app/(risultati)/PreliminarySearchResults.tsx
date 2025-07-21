import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useOTPStore } from "@/store/otpStore";
import { useEffect, useState } from 'react';
import Spinner from "@/components/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { Pie } from "victory-native";
import { PolarChart } from "victory-native";
import { LinearGradient } from "react-native-svg";
import dataClasses from '@/assets/text/dataClasses.json';

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

interface ChartData {
    label: string;
    value: number;
    color: string;
}


export default function PreliminarySearchResults() {
    const router = useRouter();
    const { email } = useOTPStore();
    const [breaches, setBreaches] = useState<Breach[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const processDataClasses = (breaches: Breach[]) => {
        const levelCounts = [
            { label: 'Violazione dati sensibili', value: 0, color: '#e74c3c' },    // Red for critical
            { label: 'Violazione password', value: 0, color: '#e67e22' },      // Orange for high
            { label: 'Violazione critica', value: 0, color: '#f39c12' },     // Yellow for medium
            { label: 'Violazione normale', value: 0, color: '#3498db' },     // Blue for low
            { label: 'Violazione standard', value: 0, color: '#2ecc71' }     // Green for minimal
        ];

        breaches.forEach(breach => {
            const hasPasswords = breach.DataClasses.includes('Passwords');
            const dataClassCount = breach.DataClasses.length;

            if (breach.IsSensitive) {
                levelCounts[0].value++;
            } else if (hasPasswords) {
                levelCounts[1].value++;
            } else if (dataClassCount >= 3) {
                levelCounts[2].value++;
            } else if (dataClassCount === 2) {
                levelCounts[3].value++;
            } else {
                levelCounts[4].value++;
            }
        });
        return levelCounts.filter(level => level.value > 0);
    };

    const translateDataClass = (enTerm: string): string => {
        const found = dataClasses.find(item => item.en === enTerm);
        return found ? found.it : enTerm; 
      };

    useEffect(() => {
        const fetchBreaches = async () => {
            if (!email) return;
            
            try {
                setLoading(true);
                const response = await fetch(`https://guardiadigitale.it/api/proxy_hipb.php?email=${encodeURIComponent(email)}`);
                
                if (response.status === 404) {
                    setBreaches([]);
                    setChartData([]);
                    return;
                }
                
                if (!response.ok) {
                    throw new Error('Errore nel recupero dei dati di violazione');
                }
                
                const data = await response.json();
                setBreaches(data || []);
                
                if (data && data.length > 0) {
                    const processedData = processDataClasses(data);
                    setChartData(processedData);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Si è verificato un errore');
                console.error('Error fetching breach data:', err);
            } finally {
               setLoading(false);
            }
        };

        fetchBreaches();
    }, [email]);

    function calculateGradientPoints(
        radius: number,
        startAngle: number,
        endAngle: number,
        centerX: number,
        centerY: number,
      ) {
        // Calculate the midpoint angle of the slice for a central gradient effect
        const midAngle = (startAngle + endAngle) / 2;
      
        // Convert angles from degrees to radians
        const startRad = (Math.PI / 180) * startAngle;
        const midRad = (Math.PI / 180) * midAngle;
      
        // Calculate start point (inner edge near the pie's center)
        const startX = centerX + radius * 0.5 * Math.cos(startRad);
        const startY = centerY + radius * 0.5 * Math.sin(startRad);
      
        // Calculate end point (outer edge of the slice)
        const endX = centerX + radius * Math.cos(midRad);
        const endY = centerY + radius * Math.sin(midRad);
      
        return { startX, startY, endX, endY };
      }

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

        const allLevels = [
            { label: 'Violazione dati sensibili', value: 0, color: '#e74c3c' },
            { label: 'Violazione password', value: 0, color: '#e67e22' },
            { label: 'Violazione critica', value: 0, color: '#f39c12' },
            { label: 'Violazione normale', value: 0, color: '#3498db' },
            { label: 'Violazione standard', value: 0, color: '#2ecc71' }
        ];

        allLevels.forEach(level => {
            const found = chartData.find(item => item.label === level.label);
            if (found) level.value = found.value;
        });

        return (
            <ScrollView style={styles.scrollContainer}>
                <Stack.Screen options={{ 
                    headerShown: true, 
                    title: 'Risultati Preliminari',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#043474" />
                        </TouchableOpacity>
                    )
                }} />
                
                <View style={styles.container}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.title}>Riepilogo Violazioni</Text>
                        <Text style={styles.subtitle}>
                            Trovate {breaches.length} violazioni per il tuo indirizzo email
                        </Text>
                    </View>
    
                    {chartData.length > 0 && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Dati Compromessi</Text>
                            <View style={styles.chartWrapper}>
                            <PolarChart
        data={chartData} 
        labelKey={"label"} 
        valueKey={"value"} 
        colorKey={"color"} 
      >
        <Pie.Chart innerRadius={60}>
          {({ slice }) => {
            const { startX, startY, endX, endY } = calculateGradientPoints(
              slice.radius,
              slice.startAngle,
              slice.endAngle,
              slice.center.x,
              slice.center.y
            );

            return (
              <Pie.Slice>
                
              </Pie.Slice>
            );
          }}
        </Pie.Chart>
      </PolarChart>
    </View>
                          
                            <View style={styles.legend}>
    <Text style={styles.legendTitle}>Legenda:</Text>
    {
    allLevels.map((level, index) => (
        <View key={index} style={styles.legendItem}>
            <View 
                style={[
                    styles.legendColor, 
                    { backgroundColor: level.color }
                ]} 
            />
            <Text style={styles.legendText} numberOfLines={2}>
                {level.label} ({level.value})
            </Text>
        </View>
    ))}
</View>
                        </View>
                    )}
    
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Riepilogo Rapido</Text>
                        <Text style={styles.summaryText}>
                            • {breaches.length} violazioni rilevate
                        </Text>
                        {chartData.length > 0 && <Text style={styles.summaryText}>
                            • Categoria più comune: {chartData[0]?.label || 'N/A'}
                        </Text>}
                    </View>
    
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => router.push('/(risultati)/SearchResults')}
                    >
                        <Text style={styles.buttonText}>Visualizza Elenco</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#043474',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#28338a',
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        alignItems: 'center',
        width: '100%',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#043474',
        marginBottom: 20,
        textAlign: 'center',
    },
    chartWrapper: {
        height: 300,
        width: '100%',
        marginBottom: 20,
    },
    legend: {
        width: '100%',
    },
    legendTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#043474',
        marginBottom: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 12,
    },
    legendText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    summaryContainer: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#043474',
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 14,
        color: '#28338a',
        marginBottom: 6,
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
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
});