import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OTPState {
  otp: string | null;
  email: string | null;
  expiresAt: number | null;
  setOTP: (email: string, otp: string) => Promise<void>;
  clearOTP: () => Promise<void>;
  loadOTP: () => Promise<void>;
  verifyOTP: (code: string) => boolean;
}

const OTP_EXPIRY = 10 * 60 * 1000; // 10 minuti in millisecondi

export const useOTPStore = create<OTPState>((set, get) => ({
  otp: null,
  email: null,
  expiresAt: null,

  setOTP: async (email: string, otp: string) => {
    const expiresAt = Date.now() + OTP_EXPIRY;
    const data = { otp, email, expiresAt };
    await AsyncStorage.setItem('@otp_data', JSON.stringify(data));
    set({ otp, email, expiresAt });
  },

  clearOTP: async () => {
    await AsyncStorage.removeItem('@otp_data');
    set({ otp: null, email: null, expiresAt: null });
  },

  loadOTP: async () => {
    const data = await AsyncStorage.getItem('@otp_data');
    if (data) {
      const { otp, email, expiresAt } = JSON.parse(data);
      set({ otp, email, expiresAt });
    }
  },

  verifyOTP: (code: string) => {
    const { otp, expiresAt } = get();
    if (!otp || !expiresAt || expiresAt < Date.now()) {
      return false;
    }
    return otp === code;
  },
}));