import { View, Text, StyleSheet, ScrollView, Image, Alert, Linking } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import dataClasses from '@/assets/text/dataClasses.json';
export default function ResultDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const breach = JSON.parse(params.breach as string);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPwnCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const showMalwareAlert = () => {
    Alert.alert(
      "Attenzione - Malware Rilevato",
      "Questo breach è associato a malware. Ti consigliamo vivamente di eseguire una scansione antivirus completa su tutti i tuoi dispositivi per garantire la sicurezza del sistema.",
      [
        { text: "Ho capito", style: "default" }
      ]
    );
  };

  const translateDataClass = (enTerm: string): string => {
    const found = dataClasses.find(item => item.en === enTerm);
    return found ? found.it : enTerm; 
  };

  const openWebsite = () => {
    const domain = breach.Domain.replace(/^https?:\/\//, '');
    const url = `https://${domain.split('/')[0]}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Dettaglio Risultato',
          headerStyle: {
            backgroundColor: '#28338a'
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.replace('/(risultati)/SearchResults')}>
              <Ionicons name="arrow-back" size={24} style={{marginRight: 10}} color="#fff" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con Logo e Titolo */}
        <View style={styles.header}>
          {breach.LogoPath !== "https://logos.haveibeenpwned.com/List.png" ? (
            <Image 
              source={{ uri: breach.LogoPath }} 
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Image 
              source={require('@/assets/images/react-logo.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>{breach.Title}</Text>
        </View>

        {/* Alert di Sicurezza */}
        {breach.IsSensitive && (
          <View style={styles.dangerAlert}>
            <Ionicons name="warning" size={24} color="#fff" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>MINACCIA GRAVE</Text>
              <Text style={styles.alertText}>
                Questo breach contiene dati sensibili. Cambia immediatamente le tue password.
              </Text>
            </View>
          </View>
        )}

        {breach.IsMalware && (
          <TouchableOpacity style={styles.malwareAlert} onPress={showMalwareAlert}>
            <Ionicons name="bug" size={24} color="#fff" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>MALWARE RILEVATO</Text>
              <Text style={styles.alertText}>
                Tocca per informazioni sulla scansione antivirus
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Statistiche */}
        <View style={styles.statsContainer}>
        <View style={styles.statItem}>
            <Text style={styles.statLabel}>Data del Breach</Text>
            <Text style={styles.statNumber}>{formatDate(breach.BreachDate)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Account Compromessi</Text>
            <Text style={styles.statNumber}>{formatPwnCount(breach.PwnCount)}</Text>
           
          </View>
        </View>

        {/* Status Verificato */}
        <View style={styles.verificationContainer}>
          <Ionicons 
            name={breach.IsVerified ? "checkmark-circle" : "help-circle"} 
            size={24} 
            color={breach.IsVerified ? "#54a4c7" : "#bfddbd"} 
          />
          <Text style={[styles.verificationText, { color: breach.IsVerified ? "#54a4c7" : "#bfddbd" }]}>
            {breach.IsVerified ? "Breach Verificato" : "Breach Non Verificato"}
          </Text>
        </View>


        {/* Dati Compromessi */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dati Compromessi</Text>
          <View style={styles.dataClassesContainer}>
            {breach.DataClasses.map((dataClass: string, index: number) => (
              <View key={index} style={styles.dataClassChip}>
                <Text style={styles.dataClassText}>{translateDataClass(dataClass)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Informazioni Aggiuntive */}
        {breach.Domain &&<View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni Aggiuntive</Text>
          {breach.Domain && <View style={styles.infoRow}>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Dominio compromesso:</Text>
              <TouchableOpacity onPress={openWebsite} style={styles.domainLink}>
                <Text style={styles.domainLinkText}>{breach.Domain}</Text>
                <Ionicons name="open-outline" size={16} color="#54a4c7" />
              </TouchableOpacity>
            </View>
          </View>}
          {/*<View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Aggiunto il:</Text>
              <Text style={styles.infoValue}>{formatDate(breach.AddedDate)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ultima modifica:</Text>
              <Text style={styles.infoValue}>{formatDate(breach.ModifiedDate)}</Text>
            </View>
          </View>*/}
        </View>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28338a',
    textAlign: 'center',
    marginBottom: 8,
  },
  domain: {
    fontSize: 16,
    color: '#54a4c7',
    fontWeight: '500',
  },
  dangerAlert: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  malwareAlert: {
    backgroundColor: '#fd7e14',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  statsContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#dbe7f2',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28338a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#54a4c7',
    textAlign: 'center',
    marginBottom: 30
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  verificationText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28338a',
    marginBottom: 16,
  },
  dataClassesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataClassChip: {
    backgroundColor: '#dbe7f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  dataClassText: {
    color: '#28338a',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#54a4c7',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#54a4c7',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#28338a',
    fontWeight: '600',
  },
  domainLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  domainLinkText: {
    fontSize: 16,
    color: '#54a4c7',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});