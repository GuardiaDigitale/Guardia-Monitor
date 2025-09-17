import dataClasses from '@/assets/text/dataClasses.json';
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from 'react';
import { Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const getBreachLevelInfo = (breach: any) => {
  if (breach.IsSensitive) return { label: 'Violazione dati sensibili', color: '#71660d' };
  if (breach.DataClasses.includes('Passwords')) return { label: 'Violazione password', color: '#d01317' };
  if (breach.DataClasses.length >= 3) return { label: 'Violazione critica', color: '#e75e0d' };
  if (breach.DataClasses.length === 2) return { label: 'Violazione normale', color: '#f6a214' };
  return { label: 'Violazione bassa', color: '#f7d81f' };
};

const AdviceModal = ({ visible, onClose, breachLevel, color }) => {
  const getAdvice = () => {
    switch(breachLevel) {
      case 'Violazione dati sensibili':
        return {
          title: 'Azione Richiesta: Massima Priorità',
          steps: [
            'Risulta sia riscontrata una violazione dei tuoi dati sensibili. Si consiglia rivolgersi al fornitore qualora indicato o ad esperti che possono aiutare a risolvere il caso.'
          ]
        };
      case 'Violazione password':
        return {
          title: 'Azione Richiesta: Alta Priorità',
          steps: [
            'Risulta una fuga di password e anche la tua risulta essere stata compromessa. Si consiglia di cambiare la password associata al dominio e tutte le password simili ad essa.'
          ]
        };
      case 'Violazione critica':
        return {
          title: 'Azione Consigliata',
          steps: [
            'È stata rilevata una violazione critica che interessa i tuoi dati. Non sono stati identificati dati sensibili esposti. Per garantire la massima sicurezza, ti consigliamo di contattare il fornitore del servizio o un esperto di sicurezza informatica per una valutazione approfondita.'
          ]
        };
      case 'Violazione normale':
        return {
          title: 'Avviso di Sicurezza',
          steps: [
            'Risulta una violazione di gravità media, il pericolo non raggiunge dati sensibili o password. Si consiglia quindi di non preoccuparsi ma di fare attenzione alle proprie interazioni.'
          ]
        };
      default:
        return {
          title: 'Informazione di Sicurezza',
          steps: [
            'Risulta una violazione con rischio basso, non ci sono dati sensibili o privati in pericolo e non sembra esserci motivo di preoccuparsi.'
          ]
        };
    }
  };

  const advice = getAdvice();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalHeader, { backgroundColor: color }]}>
            <Text style={{...styles.modalTitle, color: color === "#f7d81f" ? "#000" : "#fff"}}>{advice.title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={color === "#f7d81f" ? "#000" : "#fff"} />
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.adviceContainer}>
              {advice.steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <Pressable 
              style={[styles.modalButton, { backgroundColor: color }]}
              onPress={onClose}
            >
              <Text style={{...styles.modalButtonText, color: color === "#f7d81f" ? "#000" : "#fff"}}>Ho capito</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}


export default function ResultDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const breach = JSON.parse(params.breach as string);
  const { label, color } = getBreachLevelInfo(breach);
  const [modalVisible, setModalVisible] = useState(false);




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
        { text: "Ok", style: "default" }
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
              source={require('@/assets/images/globe.png')} 
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
      <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: color }]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={{...styles.actionButtonText, color: color === "#f7d81f" ? "#000" : "#fff"}}>COSA POSSO FARE</Text>
          </TouchableOpacity>
        </View>
        <AdviceModal 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          breachLevel={label}
          color={color}
        />
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
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  adviceContainer: {
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    color: '#333',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});