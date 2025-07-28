import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useOTPStore } from '../store/otpStore';
import AuthBottomSheet from '../components/AuthBottomSheet';
import * as Haptics from 'expo-haptics';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');



export default function MainScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = useOTPStore.subscribe(
      (state) => {
        const isAuth = state.isVerified && !!state.email;
        setIsAuthenticated(isAuth);
      }
    );
  
    checkAuthStatus();
    startPulseAnimation();
    
    return () => unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    await useOTPStore.getState().loadOTP();
    const { isVerified, email } = useOTPStore.getState();
    setIsAuthenticated(isVerified && !!email);
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleMainButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (isAuthenticated) {
      handleStartScan();
    } else {
      return;
    }

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    const { email } = useOTPStore.getState();
    const startTime = Date.now();
    
    // Avvia l'animazione
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    try {
      // Esegui la chiamata API
      const response = await fetch(`https://guardiadigitale.it/api/proxy_hipb.php?email=${encodeURIComponent(email)}`);
      console.log("url called: ", `https://guardiadigitale.it/api/proxy_hipb.php?email=${encodeURIComponent(email)}`);
      // Gestisci il caso in cui non ci siano violazioni (404)
      if (response.status === 404) {
        // Calcola il tempo rimanente per raggiungere almeno 3 secondi
        const elapsedTime = Date.now() - startTime;
        const minDelay = 3000;
        const remainingTime = Math.max(0, minDelay - elapsedTime);
        
        // Attendi il tempo rimanente
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        // Passa un array vuoto per indicare che non ci sono violazioni
        router.replace({
          pathname: '/(risultati)/PreliminarySearchResults',
          //params: { breaches: JSON.stringify([]) }
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error('Errore nel recupero dei dati di violazione');
      }
      
      const data = await response.json();
      
      // Calcola il tempo rimanente per raggiungere almeno 3 secondi
      const elapsedTime = Date.now() - startTime;
      const minDelay = 3000;
      const remainingTime = Math.max(0, minDelay - elapsedTime);
      
      // Attendi il tempo rimanente
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Passa i dati alla schermata dei risultati
      router.replace({
        pathname: '/(risultati)/PreliminarySearchResults',
       // params: { breaches: JSON.stringify(data || []) }
      });
    } catch (error) {
      console.error("Errore durante la scansione:", error);
      // Mostra un messaggio di errore all'utente
      Alert.alert("Errore", "Si è verificato un errore durante la scansione. Riprova.");
    } finally {
      setIsScanning(false);
      rotateAnim.setValue(0);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getButtonContent = () => {
    if (isScanning) {
      return {
        text: "Scansione in corso...",
        disabled: true
      };
    } else if (isAuthenticated) {
      return {
        text: "TAP TO SCAN!",
        disabled: false
      };
    } else {
      return {
        text: "Verifica la tua mail per iniziare la scansione",
        disabled: true
      };
    }
  };

  const buttonContent = getButtonContent();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{headerTitle: 'Home', headerShown: true, headerTitleStyle: { color: '#dbe7f2' }, title: 'Home', headerStyle: { backgroundColor: '#28338a' }, headerTintColor: '#fff', 
      headerLeft: () => (
        <TouchableOpacity style={{ paddingLeft: 15 }} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={30} color="#dbe7f2" />
        </TouchableOpacity>
      ) }} 
      />
      <View style={styles.header}>
        <Text style={styles.title}>
          PROTEGGI LA TUA IDENTITÀ{'\n'}DIGITALE, A PARTIRE DALLA{'\n'}TUA E-MAIL
        </Text>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity
          onPress={handleMainButtonPress}
          activeOpacity={buttonContent.disabled ? 1 : 0.8}
          disabled={buttonContent.disabled}
          style={styles.iconTouchable}
        >
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                transform: [
                  { scale: isAuthenticated ? Animated.multiply(scaleAnim, pulseAnim) : scaleAnim },
                  { rotate: isScanning ? rotate : '0deg' }
                ]
              }
            ]}
          >
            <View style={[
              styles.iconCircle,
              buttonContent.disabled && styles.disabledIcon
            ]}>
              <Image 
                source={require('@/assets/images/buttonLogo.png')}
                style={[
                  styles.shieldImage,
                  buttonContent.disabled && styles.disabledImage
                ]}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.buttonText}>{buttonContent.text}</Text>
          <Text style={styles.buttonSubtext}>
            {isAuthenticated && !isScanning ? 'premi per iniziare la scansione' : ''}
          </Text>
        </View>
      </View>

      <AuthBottomSheet
        onAuthSuccess={handleAuthSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbe7f2',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  menuButton: {
    padding: 10,
  },
  menuLine: {
    width: 24,
    height: 3,
    backgroundColor: '#54a4c7',
    marginVertical: 2,
    borderRadius: 2,
  },
  exportButton: {
    padding: 10,
  },
  exportIcon: {
    fontSize: 20,
    color: '#54a4c7',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#54a4c7',
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: 0.5,
  },
  mainContent: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  iconTouchable: {
    marginBottom: 60,
  },
  iconContainer: {

  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#54a4c7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledIcon: {
    backgroundColor: '#54a4c7',
    opacity: 0.4,
    transform: [{ scale: 0.95 }],
  },
  shieldImage: {
    width: 80,
    height: 80,
    tintColor: '#ffffff', // Colora l'icona di bianco
  },
  disabledImage: {
    opacity: 0.6,
  },
  networkLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  dot1: {
    top: 20,
    left: 30,
  },
  dot2: {
    top: 30,
    right: 25,
  },
  dot3: {
    bottom: 25,
    left: 25,
  },
  dot4: {
    bottom: 30,
    right: 30,
  },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonText: {
    color: '#54a4c7',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#54a4c7',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
});