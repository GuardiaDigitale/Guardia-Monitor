import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConsulenzaIntroScreen() {
  const router = useRouter();

  const handleTelefonare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('tel:+390550108325');
  };
  
   const handleCompilaModulo = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const email = 'nis2@guardiadigitale.it';
    const subject = 'Richiesta di consulenza NIS2';
    const body = 'Salve,\n\nvorrei ricevere una prima consulenza gratuita da GUARDIA DIGITALE circa la conformità alla Direttiva NIS2.\n\nCordiali saluti,';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Errore',
          'Impossibile aprire il client di posta. Si prega di configurare un account email sul dispositivo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Errore nell\'apertura del client di posta:', error);
      Alert.alert(
        'Errore',
        'Si è verificato un errore durante l\'apertura del client di posta.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Consulenza',
          headerStyle: {
            backgroundColor: '#043474',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity style={{padding: 8}} onPress={() => router.push('/')}
            >
              <Ionicons name="home" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }}
      />

      <View style={styles.content}>
        <Text style={styles.mainTitle}>RICHIEDI</Text>
        <Text style={styles.mainTitle}>UNA CONSULENZA</Text>

        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image 
          source={require('@/assets/images/GD.png')} 
          style={styles.logo} 
          resizeMode="cover"
        />
          </View>
          {/*<Text style={styles.logoSubtext}>GUARDIA DIGITALE</Text>*/}
        </View>

        {/*<View style={styles.centeredSection}>
          <Text style={styles.centeredTitle}>CYBERSECURITY CHECK ONLINE GRATUITO</Text>
          <Text style={styles.centeredText}>
            Inviaci la tua richiesta e ti ricontatteremo per proporti date/orari per il meet online gratuito di 30' al fine di effettuare un primo check gratuito con l'elaborazione di un dettagliato report finale.
          </Text>
          <TouchableOpacity 
            onPress={() => Linking.openURL('https://guardiadigitale.it/privacy-policy/')}
            style={styles.privacyLink}
          >
            <Text style={styles.privacyText}>Leggere l'informativa Privacy</Text>
          </TouchableOpacity>
        </View>*/}


        <TouchableOpacity 
          style={styles.compilaButton}
          onPress={handleCompilaModulo}
          activeOpacity={0.8}
        >
          <Text style={styles.compilaButtonText}>RICHIEDI VIA EMAIL</Text>
        </TouchableOpacity>
        {/*1a73e8 */}
        <TouchableOpacity 
          style={{
            backgroundColor: '#1a73e8',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginVertical: 5,
            width: 'auto',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#1a73e8',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
            flexDirection: 'row',
            gap: 8,
            minWidth: 160,
          }}
          onPress={handleTelefonare}
          activeOpacity={0.9}
        >
          <Ionicons name="call-outline" size={16} color="#fff" />
          <Text style={{
            color: '#fff',
            fontSize: 14,
            fontWeight: '600',
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            lineHeight: 16,
          }}>Chiama Ora</Text>
        </TouchableOpacity>
        

        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contattaci</Text>
          
          <Text style={styles.contactEmail}>nis2@guardiadigitale.it</Text>
          
          <Text style={styles.contactPhone}>(+39) 055 0108325</Text>
          
          <Text style={styles.contactAddress}>
            Piazza Madonna della Neve, 5 - 50122{'\n'}
            FIRENZE (ITALIA)
          </Text>
          
          <Text style={styles.contactHours}>
            LUN-VEN: 9-12 e 14.30-17.30
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  hamburgerMenu: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#333',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -20,
  },
  logoG: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 2,
  },
  logoD: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginRight: 8,
  },
  logoIcon: {
    width: 20,
    height: 20,
    justifyContent: 'space-between',
  },
  logoIconTop: {
    width: 20,
    height: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  logoIconBottom: {
    width: 20,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  logoSubtext: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    letterSpacing: 2,
  },
  compilaButton: {
    backgroundColor: '#043474',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 40,
    minWidth: 250,
  },
  telefonareButton: {
    backgroundColor: '#043474',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 40,
    minWidth: 250,
  },
  
  compilaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  contactInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  contactPhone: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: '500',
  },
  contactAddress: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 15,
  },
  contactHours: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
    alignSelf: 'center',
  },
});