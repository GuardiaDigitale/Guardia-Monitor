import { useState } from "react";
import { useOTPStore } from "../../store/otpStore";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const { email, verifyOTP, clearOTP } = useOTPStore();
    const router = useRouter();


  
    useEffect(() => {
      if (!email) {
        router.push('/');
      }
    }, [email]);
  
    const handleVerify = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (verifyOTP(otp)) {
        //Alert.alert('Successo', 'Codice OTP verificato con successo!');
        //clearOTP();
        AsyncStorage.setItem('@is_authenticated', 'true');
        router.push('/(risultati)/SearchResults');
      } else {
        setError('Codice OTP non valido o scaduto');
      }
    };
    const handleCancel = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      clearOTP();
      router.push('/');
    };
  
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Verifica OTP' }}>
        
        </Stack.Screen>
        <Text style={styles.title}>Verifica OTP</Text>
        <Text style={styles.subtitle}>Inserisci il codice OTP inviato a {email}</Text>
        
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={otp}
          onChangeText={(text) => {
            setOtp(text);
            setError('');
          }}
          placeholder="Inserisci codice OTP"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, otp.length !== 6 && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={otp.length !== 6}
        >
          <Text style={styles.buttonText}>Verifica</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.buttonCancel]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonTextCancel}>Annulla</Text>
        </TouchableOpacity>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '#dbe7f2', // Light blue background
    },
    title: {
      fontSize: 24,
      fontFamily: 'SofiaProSoft-Bold',
      color: '#28338a', // Dark blue
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'SofiaProSoft-Light',
      color: '#28338a', // Dark blue
      marginBottom: 32,
      textAlign: 'center',
    },
    input: {
      borderWidth: 2,
      borderColor: '#54a4c7', // Medium blue
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      backgroundColor: 'white',
      fontFamily: 'SofiaProSoft-Light',
      fontSize: 16,
      color: '#28338a',
    },
    buttonContainer: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 24,
    },
    button: {
      backgroundColor: '#54a4c7', // Medium blue
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 3,
    },
    buttonCancel: {
      backgroundColor: '#e74c3c', // Rosso per l'annullamento
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontFamily: 'SofiaProSoft-Bold',
    },
    buttonTextCancel: {
      color: 'white',
      fontSize: 16,
      fontFamily: 'SofiaProSoft-Bold',
    },
    inputError: {
      borderColor: '#e74c3c', // Rosso per errore
    },
    errorText: {
      color: '#e74c3c', // Rosso per errore
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: 'SofiaProSoft-Light',
    },
  });