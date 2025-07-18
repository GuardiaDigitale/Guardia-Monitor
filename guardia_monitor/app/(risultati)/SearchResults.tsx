import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useOTPStore } from "../../store/otpStore";
import { useEffect, useState } from 'react';
import { FlashList } from "@shopify/flash-list";
import Spinner from "@/components/Spinner";

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

export default function SearchResults() {
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
                        <TouchableOpacity onPress={() => router.push('/(risultati)/PreliminarySearchResults')}>
                           <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#043474" />
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
                        <TouchableOpacity onPress={() => router.push('/(risultati)/PreliminarySearchResults')}>
                           <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#043474" />
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
                        <TouchableOpacity onPress={() => router.push('/(risultati)/PreliminarySearchResults')}>
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
            <Stack.Screen options={{ 
                headerShown: true, 
                title: 'Risultati',
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.push('/(risultati)/PreliminarySearchResults')}>
                       <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#043474" />
                    </TouchableOpacity>
                )
            }} />
            
            <View style={styles.listContainer}>
            <Text style={[styles.title, {color: '#d32f2f'}]}>⚠️ La tua email {email} è coinvolta in {breaches.length} violazioni di sicurezza</Text>
    <FlashList
  data={breaches.sort((a,b) => new Date(b.BreachDate).getTime() - new Date(a.BreachDate).getTime())}
  renderItem={({ item }) => {
    const formattedDate = new Date(item.BreachDate).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return (
      <TouchableOpacity 
        style={styles.breachCard}
        activeOpacity={0.9}
        onPress={() => router.push('/(risultati)/ResultDetail')}
      >
        <View style={styles.breachContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: item.LogoPath }} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
          
          {/* Testo */}
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.breachName} numberOfLines={1}>
                {item.Name}
              </Text>
              <View style={styles.arrowIcon}>
                {/*<Ionicons 
                name="chevron-forward" 
                size={18} 
                color="#7C8DB5" 
                style={styles.arrowIcon}
              />*/}
              </View>
            </View>
            
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar" size={14} color="#7C8DB5" style={styles.metaIcon} />
                <Text style={styles.metaText}>{formattedDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="people" size={14} color="#7C8DB5" style={styles.metaIcon} />
                <Text style={styles.metaText}>{item.PwnCount.toLocaleString()}</Text>
              </View>
            </View>
            
          </View>
        </View>
      </TouchableOpacity>
    );
  }}
  keyExtractor={(item, index) => index.toString()}
  estimatedItemSize={80}
  contentContainerStyle={styles.listContent}
  ItemSeparatorComponent={() => <View style={styles.separator} />}
/>
</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    scrollView: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#043474',
        textAlign: 'center',
    },
    noBreaches: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
      },
      arrowIcon: {
        marginLeft: 8,
        alignSelf: 'center',
      },
      breachName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3A5E',
        marginBottom: 4,
        flex: 1,
        alignSelf: 'center',
      },
      moreInfo: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F0F2F8',
      },
      moreInfoText: {
        fontSize: 13,
        color: '#7C8DB5',
        marginBottom: 4,
      },
      dataClassesPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      dataClassPreview: {
        fontSize: 13,
        color: '#4A5A8A',
        marginRight: 4,
      },
      moreItemsPreview: {
        fontSize: 13,
        color: '#7C8DB5',
        fontStyle: 'italic',
      },
    listContent: {
        padding: 16,
      },
      separator: {
        height: 12,
      },
      breachCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
      },
      breachContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F7FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      },
      logo: {
        width: 24,
        height: 24,
      },
      textContainer: {
        flex: 1,
      },
      metaContainer: {
        flexDirection: 'row',
      },
      metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
      },
      metaIcon: {
        marginRight: 4,
      },
      metaText: {
        fontSize: 13,
        color: '#7C8DB5',
      },
      statusBadge: {
        backgroundColor: '#FFE8E8',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
      },
      statusText: {
        color: '#FF5E5E',
        fontSize: 12,
        fontWeight: '600',
      },
      breachLogoContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        overflow: 'hidden',
      },
      breachLogo: {
        width: 32,
        height: 32,
      },
      breachInfo: {
        flex: 1,
      },
      breachMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      },
      breachDate: {
        fontSize: 13,
        color: '#6B7280',
      },
      dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#9CA3AF',
        marginHorizontal: 8,
      },
      breachCount: {
        fontSize: 13,
        color: '#6B7280',
      },
      dataClassesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
      },
      dataClassBadge: {
        backgroundColor: '#EFF6FF',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 4,
      },
      dataClassText: {
        fontSize: 12,
        color: '#1E40AF',
        fontWeight: '500',
      },
      moreItems: {
        fontSize: 12,
        color: '#6B7280',
        marginLeft: 4,
        alignSelf: 'center',
      },
    errorText: {
        color: '#e74c3c',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        marginTop: 20,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginBottom: 10,
        textAlign: 'center',
    },
    successText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        lineHeight: 24,
    },
    listContainer: {
        flex: 1,
        width: '100%',
    },
});