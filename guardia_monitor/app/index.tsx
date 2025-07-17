import { useCallback, useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useOTPStore } from "../store/otpStore";
import * as Haptics from 'expo-haptics';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
const { width } = Dimensions.get('window');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function Index() {
  const animation = new Animated.Value(0);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  /*const [loaded] = useFonts({
    SofiaProSoftLight: require('../assets/fonts/SofiaProSoftLight.ttf'),
    SofiaProSoftBold: require('../assets/fonts/SofiaProSoftBold.ttf'),
  });*/

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      await useOTPStore.getState().loadOTP();
      const { expiresAt } = useOTPStore.getState();
      
      if (expiresAt && expiresAt > Date.now()) {
        // Se l'OTP è valido e non è scaduto, vai alla verifica
        router.replace('/(risultati)/verifyOTP');
      } else {
        // In tutti gli altri casi, torna alla home
        router.replace('/');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);





  const handleSubmit = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!validateEmail(email)) {
      setIsValid(false);
      return;
    }

    setIsLoading(true);
    const otp = generateOTP();
    
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
      console.log("OTP inviato con successo");
      console.log(otp);
      router.push('/(risultati)/verifyOTP');
    } else {
          setIsValid(false);
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
      setIsLoading(false);
    }
  }, [email]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

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

  const inputBorderColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#007AFF']
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          {/*<Image
            source={require('@/assets/images/guardia-logo.png')}
            style={styles.logo}
            resizeMode="cover"
          />*/}
          <Text style={styles.title}>Benvenuto in</Text>
          <Text style={styles.brand}>Guardia Monitor</Text>
        </View>

        <View style={styles.introBox}>
          <Text style={styles.introText}>Testo di introduzione all'app...</Text>
        </View>

        <View style={styles.formSection}>
          <Animated.View 
            style={[
              styles.inputWrapper,
              { 
                borderColor: !isValid ? '#ff4444' : isFocused ? '#007AFF' : '#e0e0e0',
                transform: [
                  {
                    translateX: !isValid ? 
                      new Animated.Value(0) : 
                      animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                      })
                  }
                ]
              }
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="La tua email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              onFocus={handleFocus}
              onBlur={handleBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </Animated.View>
          
          {!isValid && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Inserisci un'email valida</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.button, styles.shadow]}
            onPress={handleSubmit}
            activeOpacity={0.9}
          >
            <Text style={styles.buttonText}>Invia mail</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dbe7f2', // Light blue background from the palette
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#28338a', // Dark blue from the palette
    textAlign: 'center',
    fontFamily: 'SofiaProSoft-Light', // Need to load this font
    marginBottom: 8,
  },
  brand: {
    fontSize: 36,
    fontWeight: '700',
    color: '#28338a', // Dark blue from the palette
    textAlign: 'center',
    fontFamily: 'SofiaProSoft-Bold', // Need to load this font
  },
  introBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#28338a',
    textAlign: 'center',
    fontFamily: 'SofiaProSoft-Light',
  },
  formSection: {
    width: '100%',
  },
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderColor: '#54a4c7', // Medium blue from the palette
  },
  input: {
    padding: 18,
    fontSize: 16,
    color: '#28338a',
    fontFamily: 'SofiaProSoft-Light',
  },
  errorContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'SofiaProSoft-Light',
  },
  button: {
    backgroundColor: '#54a4c7', // Medium blue from the palette
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'SofiaProSoft-Bold',
  },
  // Add a logo style if you want to add the Guardia Monitor logo
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  shadow: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});