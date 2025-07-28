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
        const levelCounts= [
            { label: 'Violazione dati sensibili', value: 0, color: '#71660d' },
            { label: 'Violazione password', value: 0, color: '#d01317' },
            { label: 'Violazione critica', value: 0, color: '#e75e0d' },
            { label: 'Violazione normale', value: 0, color: '#f6a214' },
            { label: 'Violazione bassa', value: 0, color: '#f7d81f' }
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
        // Calcola il punto medio dell'angolo per l'effetto gradiente centrale
        const midAngle = (startAngle + endAngle) / 2;
      
        // Converti angoli in radianti
        const startRad = (Math.PI / 180) * startAngle;
        const midRad = (Math.PI / 180) * midAngle;
      
        // Calcola il punto di partenza (lato interno vicino al centro del grafico)
        const startX = centerX + radius * 0.5 * Math.cos(startRad);
        const startY = centerY + radius * 0.5 * Math.sin(startRad);
      
        // Calcola il punto finale (lato esterno dell'angolo)
        const endX = centerX + radius * Math.cos(midRad);
        const endY = centerY + radius * Math.sin(midRad);
      
        return { startX, startY, endX, endY };
      }

    if (loading) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ 
                    headerShown: true, 
                    headerStyle: { backgroundColor: '#28338a' }, headerTintColor: '#fff',
                    title: 'Caricamento',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.replace('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#fff" />
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
                    headerStyle: { backgroundColor: '#28338a' }, headerTintColor: '#fff',
                    title: 'Errore',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.replace('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#fff" />
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
          <View style={{
            flex: 1,
            backgroundColor: '#c8e6c9',
          }}>
            <Stack.Screen options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#28338a' }, headerTintColor: '#fff',
              title: 'Nessuna violazione',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.replace('/')}>
                  <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#fff" />
                </TouchableOpacity>
              )
            }} />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
            }}>
              <View style={styles.smileyContainer}>
                <Ionicons name="happy-outline" size={80} color="#043474" style={styles.smileyIcon} />
              </View>
              <Text style={styles.successTitle}>OTTIME NOTIZIE!</Text>
              <Text style={styles.successText}>
                La tua mail non è stata rilevata{'\n'}
                in nessuna violazione fra{'\n'}
                quelle da noi monitorate
              </Text>
            </View>
          </View>
        );
      }

        const allLevels = [
            { label: 'Violazione dati sensibili', value: 0, color: '#76160d' },
            { label: 'Violazione password', value: 0, color: '#d01317' },
            { label: 'Violazione critica', value: 0, color: '#e75e0d' },
            { label: 'Violazione normale', value: 0, color: '#f6a214' },
            { label: 'Violazione bassa', value: 0, color: '#f7d81f' }
        ];

        allLevels.forEach(level => {
            const found = chartData.find(item => item.label === level.label);
            if (found) level.value = found.value;
        });

        return (
            <ScrollView style={styles.scrollContainer}>
                <Stack.Screen options={{ 
                    headerShown: true, 
                    headerStyle: { backgroundColor: '#28338a' }, headerTintColor: '#fff',
                    title: 'Risultato',
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.replace('/')}>
                           <Ionicons name="home" size={24} style={{marginRight: 10}} color="#fff" />
                        </TouchableOpacity>
                    )
                }} />
                
                <View style={styles.container}>
              
    
                    {chartData.length > 0 && (
                        <View style={styles.chartContainer}>
                            <View style={styles.statsContainer}>
                                <Text style={[styles.title, { fontSize: 24, fontWeight: 'bold' }]}>
                                    {breaches.length} Violazioni trovate
                                </Text>
                            </View>
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
    
                    {/*<View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Riepilogo Rapido</Text>
                        <Text style={styles.summaryText}>
                            • {breaches.length} violazioni rilevate
                        </Text>
                        {chartData.length > 0 && <Text style={styles.summaryText}>
                            • Categoria più comune: {chartData[0]?.label || 'N/A'}
                        </Text>}
                    </View>*/}
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={() => router.replace('/(risultati)/SearchResults')}
                    >
                        <Text style={styles.buttonText}>Visualizza Elenco</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={() => router.replace('/(contatti)/ConsulenzaIntro')}
                    >
                        <Text style={styles.buttonText}>Richiedi consulenza</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" style={{marginLeft: 8}} />
                    </TouchableOpacity>
    
                   
                    </View>
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
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: '#dbe7f2',
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
        height: 200,
        width: '100%',
        marginBottom: 20,
    },
    legend: {
        width: '100%',
        gap: 5,
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
        fontWeight: 'bold',
        color: '#043474',
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
      smileyContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#043474',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 30,
      },
      successTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#043474',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 1,
      },
      successText: {
        fontSize: 16,
        color: '#043474',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
      },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    button: {
        backgroundColor: '#043474',
        paddingVertical: 15,
        paddingHorizontal: 80,
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
    secondaryButton: {
        backgroundColor: '#54a4c7',
        paddingVertical: 15,
        paddingHorizontal: 70,
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