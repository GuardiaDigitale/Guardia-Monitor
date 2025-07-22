import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OTPState {
  otp: string | null;
  email: string | null;
  isVerified: boolean;  
  setEmail: (email: string) => Promise<void>;
  setOTP: (email: string, otp: string) => Promise<void>;
  clearOTP: () => Promise<void>;
  loadOTP: () => Promise<void>;
  verifyOTP: (code: string) => Promise<boolean>;  
  setVerified: (status: boolean) => void;
}

export const useOTPStore = create<OTPState>((set, get) => ({
  otp: null,
  email: null,
  isVerified: false,  

  setEmail: async (email: string) => {
    const { otp, isVerified } = get();
    const data = { otp, email, isVerified };
    await AsyncStorage.setItem('@otp_data', JSON.stringify(data));
    set({ email });
  },

  setOTP: async (email: string, otp: string) => {
    const data = { otp, email, isVerified: false }; 
    await AsyncStorage.setItem('@otp_data', JSON.stringify(data));
    set({ otp, email, isVerified: false });  
  },

  clearOTP: async () => {
    await AsyncStorage.removeItem('@otp_data');
    set({ otp: null, email: null, isVerified: false });
  },

  loadOTP: async () => {
    const data = await AsyncStorage.getItem('@otp_data');
    if (data) {
      const { otp, email, isVerified = false } = JSON.parse(data);
      set({ otp, email, isVerified });
    }
  },

  verifyOTP: async (code: string) => {
    const { otp } = get();
    const isVerified = otp === code;
    if (isVerified) {
      const { email } = get();
      const data = { otp, email, isVerified: true };
      await AsyncStorage.setItem('@otp_data', JSON.stringify(data));
      set({ isVerified: true });
    }
    return isVerified;
  },

  setVerified: async (status: boolean) => {
    const { otp } = get();
    set({ isVerified: status });
    const { email } = get();
    const data = { otp, email, isVerified: status };
    await AsyncStorage.setItem('@otp_data', JSON.stringify(data));
  }
}));