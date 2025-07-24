import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useOTPStore } from '../store/otpStore';
import * as Haptics from 'expo-haptics';
import Spinner from '@/components/Spinner';

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function AuthBottomSheet({ onAuthSuccess }) {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '50%', '85%'], []);
  
  // Stati per il flusso di autenticazione
  const [authStep, setAuthStep] = useState('email'); // 'email', 'otp', 'authenticated'
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isOtpValid, setIsOtpValid] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  
  // Animazioni
  const animation = new Animated.Value(0);

  // Aggiungi uno stato per sapere se siamo autenticati
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSheetChanges = useCallback((index) => {
    if (index === 0) {
      // Quando torniamo alla linguetta, mostra l'indicatore
      //setAuthStep('tab');
    } else {
      // Quando espandiamo, mostra il contenuto appropriato
      /*if (authStep === 'tab') {
        checkAuthStatus();
      }*/
    }
  }, [authStep]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    setIsAuthenticated(authStep === 'authenticated');
  }, [authStep]);

  const checkAuthStatus = async () => {
    await useOTPStore.getState().loadOTP();
    const { isVerified,email,otp } = useOTPStore.getState();
    if (isVerified) {
      setAuthStep('authenticated');
    } else {
      if (email && !isVerified) {
        setAuthStep('otp');
      } else {
        setAuthStep('email');
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailSubmit = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!validateEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    setIsLoading(true);
    const otp = generateOTP();
    console.log('OTP generato:', otp);
    
    try {
      const response = await fetch('https://guardiadigitale.it/api/send_otp_simple.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await useOTPStore.getState().setOTP(email, otp);
        setAuthStep('otp');
      } else {
        setIsEmailValid(false);
        const shake = new Animated.Value(0);
        Animated.sequence([
          Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
      }
    } catch (error) {
      Alert.alert(
        "Errore",
        "Si è verificato un errore durante l'invio del codice OTP. Riprova più tardi."
      );
    } finally {
      useOTPStore.getState().setEmail(email);
      setIsLoading(false);
    }
  }, [email]);

  const handleOtpSubmit = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const { otp: storedOtp } = useOTPStore.getState();
    
    if (otpInput !== storedOtp) {
      setIsOtpValid(false);
      return;
    }

    setAuthStep('authenticated');
    useOTPStore.getState().setVerified(true);
    onAuthSuccess();
    bottomSheetRef.current?.collapse();
  }, [otpInput, onAuthSuccess]);

  const handleLogout = useCallback(async () => {
    await useOTPStore.getState().clearOTP();
    setEmail('');
    setOtpInput('');
    useOTPStore.getState().setVerified(false);
    setAuthStep('email');
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  };
  

  const renderContent = () => {
    const isAuthenticated = useOTPStore.getState().isVerified;
    // Se siamo al primo snap point (linguetta), mostra solo l'indicatore
    /*if (authStep === 'tab') {
      if (isTabLoading) {
        return (
          <View style={styles.tabContainer}>
            <View style={styles.tabContent}>
              <Spinner />
              <Text style={[styles.tabText, styles.loadingText]}>
                Verifica stato...
              </Text>
            </View>
          </View>
        );
      }  
      return (
        <View style={styles.tabContainer}>
          <View style={styles.tabContent}>
            <Text style={styles.tabText}>
              {isAuthenticated ? 'La tua mail: ' + emailToShow : 'Inserisci la tua email'}
            </Text>
          </View>
        </View>
      );
    }*/

    if (isLoading) {
      return (
        <View style={styles.centeredContent}>
          <Spinner />
          <Text style={styles.loadingText}>Invio email in corso...</Text>
        </View>
      );
    }

    switch (authStep) {
      case 'email':
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Inserisci la tua email</Text>
            <Text style={styles.subtitle}>Ti invieremo un codice di verifica</Text>
            
            <Animated.View 
              style={[
                styles.inputWrapper,
                { 
                  borderColor: !isEmailValid ? '#ff4444' : isFocused ? '#007AFF' : '#e0e0e0',
                }
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="La tua email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setIsEmailValid(true);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>
            
            {!isEmailValid && (
              <Text style={styles.errorText}>Inserisci un'email valida</Text>
            )}

            <TouchableOpacity 
              style={[styles.button, styles.shadow]}
              onPress={handleEmailSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Ottieni Codice</Text>
            </TouchableOpacity>
          </View>
        );

      case 'otp':
        const emailToShowOtp = useOTPStore.getState().email;
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Inserisci il codice</Text>
            <Text style={styles.subtitle}>
              Abbiamo inviato un codice a {emailToShowOtp}
            </Text>
            
            <Animated.View 
              style={[
                styles.inputWrapper,
                { 
                  borderColor: !isOtpValid ? '#ff4444' : isFocused ? '#007AFF' : '#e0e0e0',
                }
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Codice a 6 cifre"
                placeholderTextColor="#999"
                value={otpInput}
                onChangeText={(text) => {
                  setOtpInput(text);
                  setIsOtpValid(true);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                keyboardType="numeric"
                maxLength={6}
              />
            </Animated.View>
            
            {!isOtpValid && (
              <Text style={styles.errorText}>Codice non valido</Text>
            )}

            <TouchableOpacity 
              style={[styles.button, styles.shadow]}
              onPress={handleOtpSubmit}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Verifica</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.linkButton}
              onPress={() => setAuthStep('email')}
            >
              <Text style={styles.linkText}>Cambia email</Text>
            </TouchableOpacity>
          </View>
        );

      case 'authenticated':
        const emailToShowAuthenticated = useOTPStore.getState().email;
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Email Verificata</Text>
            <Text style={styles.subtitle}>
              {emailToShowAuthenticated}
            </Text>
            
            <View style={styles.authenticatedInfo}>
              <Text style={styles.infoText}>✅ Pronto per la scansione</Text>
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
              activeOpacity={0.9}
            >
              <Text style={styles.buttonText}>Cambia indirizzo mail</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };
  

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0} // Inizia sempre alla linguetta
      snapPoints={snapPoints}
      enablePanDownToClose={false} // Non permettere di chiudere completamente
      onChange={handleSheetChanges}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        {renderContent()}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#54a4c7',
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderColor: '#bdc3c7',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#54a4c7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#54a4c7',
    fontSize: 16,
    fontWeight: '500',
  },
  authenticatedInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
    borderRightWidth: 4,
    borderRightColor: '#2ecc71',
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  infoText: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '500',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#54a4c7',
    textAlign: 'center',
    marginTop: 16,
  },
  tabLoadingText: {
    fontSize: 14,
    color: '#54a4c7',
    marginTop: 8,
  },
  shadow: {
    shadowColor: '#54a4c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  tabContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#f5f9fc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1f0f7',
  },
  tabText: {
    fontSize: 16,
    color: '#54a4c7',
    fontWeight: '600',
  },
});