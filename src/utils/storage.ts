import {
  Medication,
  DoseLog,
  VitalReading,
  HealthBadge,
  EmergencyInfo,
  AlarmSoundTone,
  UserProfile
} from '../types';
import {
  INITIAL_MEDICATIONS,
  INITIAL_BADGES,
  INITIAL_EMERGENCY_INFO,
  generateInitialVitalsAndLogs
} from './chronobiology';

const STORAGE_KEYS = {
  MEDICATIONS: 'chronomed_medications_v1',
  DOSE_LOGS: 'chronomed_dose_logs_v1',
  VITALS: 'chronomed_vitals_v1',
  BADGES: 'chronomed_badges_v1',
  EMERGENCY_INFO: 'chronomed_emergency_info_v1',
  ALARM_SETTINGS: 'chronomed_alarm_settings_v1',
  LAST_INIT: 'chronomed_initialized_v1',
  CURRENT_USER: 'chronomed_current_user_v1',
  ACCOUNTS: 'chronomed_registered_accounts_v1',
  RESET_CODES: 'chronomed_reset_codes_v1'
};

export interface StoredAccount {
  user: UserProfile;
  passwordHash: string; // Plain/stored password in client mock database
}

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-eleanor',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@chronomed.io',
    role: 'Patient (Hypertension & Lipid Care)',
    medicalRecordNumber: 'MRN-849204',
    emergencyPhone: '+1 (555) 234-5678',
    conditions: ['Stage 1 Hypertension', 'Hyperlipidemia', 'Mild Insomnia']
  },
  {
    id: 'user-himanshi',
    name: 'Himanshi Wanjari',
    email: 'wanjarihimanshi@gmail.com',
    role: 'Patient (Preventative Wellness)',
    medicalRecordNumber: 'MRN-912834',
    emergencyPhone: '+1 (555) 987-6543',
    conditions: ['Cardiovascular Wellness', 'Routine Vitamin Regimen']
  }
];

const INITIAL_ACCOUNTS: StoredAccount[] = [
  {
    user: DEMO_USERS[0],
    passwordHash: 'password123'
  },
  {
    user: DEMO_USERS[1],
    passwordHash: 'chronomed2026'
  }
];

export interface AlarmSettings {
  enabled: boolean;
  soundTone: AlarmSoundTone;
  volume: number;
  browserNotifications: boolean;
  snoozeDurationMinutes: number;
  autoRefillAlerts: boolean;
}

export const DEFAULT_ALARM_SETTINGS: AlarmSettings = {
  enabled: true,
  soundTone: 'gentle_chime',
  volume: 80,
  browserNotifications: true,
  snoozeDurationMinutes: 5,
  autoRefillAlerts: true
};

export function loadMedications(): Medication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load medications:', e);
  }
  saveMedications(INITIAL_MEDICATIONS);
  return INITIAL_MEDICATIONS;
}

export function saveMedications(meds: Medication[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  } catch (e) {
    console.error('Failed to save medications:', e);
  }
}

export function loadDoseLogs(): DoseLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DOSE_LOGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load dose logs:', e);
  }
  const { logs } = generateInitialVitalsAndLogs();
  saveDoseLogs(logs);
  return logs;
}

export function saveDoseLogs(logs: DoseLog[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.DOSE_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save dose logs:', e);
  }
}

export function loadVitals(): VitalReading[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VITALS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load vitals:', e);
  }
  const { vitals } = generateInitialVitalsAndLogs();
  saveVitals(vitals);
  return vitals;
}

export function saveVitals(vitals: VitalReading[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.VITALS, JSON.stringify(vitals));
  } catch (e) {
    console.error('Failed to save vitals:', e);
  }
}

export function loadBadges(): HealthBadge[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BADGES);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load badges:', e);
  }
  saveBadges(INITIAL_BADGES);
  return INITIAL_BADGES;
}

export function saveBadges(badges: HealthBadge[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error('Failed to save badges:', e);
  }
}

export function loadEmergencyInfo(): EmergencyInfo {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EMERGENCY_INFO);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load emergency info:', e);
  }
  saveEmergencyInfo(INITIAL_EMERGENCY_INFO);
  return INITIAL_EMERGENCY_INFO;
}

export function saveEmergencyInfo(info: EmergencyInfo) {
  try {
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_INFO, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save emergency info:', e);
  }
}

export function loadAlarmSettings(): AlarmSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ALARM_SETTINGS);
    if (data) {
      return { ...DEFAULT_ALARM_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load alarm settings:', e);
  }
  saveAlarmSettings(DEFAULT_ALARM_SETTINGS);
  return DEFAULT_ALARM_SETTINGS;
}

export function saveAlarmSettings(settings: AlarmSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.ALARM_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save alarm settings:', e);
  }
}

export function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.MEDICATIONS);
  localStorage.removeItem(STORAGE_KEYS.DOSE_LOGS);
  localStorage.removeItem(STORAGE_KEYS.VITALS);
  localStorage.removeItem(STORAGE_KEYS.BADGES);
  localStorage.removeItem(STORAGE_KEYS.EMERGENCY_INFO);
  localStorage.removeItem(STORAGE_KEYS.ALARM_SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.RESET_CODES);
}

// ================= USER AUTHENTICATION & SESSIONS =================

export function loadAccounts(): StoredAccount[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load accounts:', e);
  }
  saveAccounts(INITIAL_ACCOUNTS);
  return INITIAL_ACCOUNTS;
}

export function saveAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts:', e);
  }
}

export function loadCurrentUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load current user session:', e);
  }
  // If not logged in, return null to start at Sign In screen
  return null;
}

export function saveCurrentUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error('Failed to save current user session:', e);
  }
}

export function loginUser(
  email: string,
  password: string
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = loadAccounts();

  const account = accounts.find(
    (a) => a.user.email.toLowerCase() === normalizedEmail
  );

  if (!account) {
    return {
      success: false,
      error: 'No account found with this email address. Please check your spelling or sign up.'
    };
  }

  if (account.passwordHash !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please try again or use "Forgot Password".'
    };
  }

  saveCurrentUser(account.user);
  return { success: true, user: account.user };
}

export function registerUser(
  name: string,
  email: string,
  password: string,
  conditions?: string[]
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = loadAccounts();

  if (accounts.some((a) => a.user.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.'
    };
  }

  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: 'Patient (Self-Enrolled)',
    medicalRecordNumber: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
    emergencyPhone: '+1 (555) 000-1234',
    conditions: conditions || ['General Preventive Health']
  };

  const updatedAccounts = [...accounts, { user: newUser, passwordHash: password }];
  saveAccounts(updatedAccounts);
  saveCurrentUser(newUser);

  return { success: true, user: newUser };
}

export function requestPasswordResetCode(
  email: string
): { success: boolean; code?: string; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = loadAccounts();

  const account = accounts.find(
    (a) => a.user.email.toLowerCase() === normalizedEmail
  );

  if (!account) {
    return {
      success: false,
      error: 'No registered patient account found with this email address.'
    };
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store code in localStorage with 15-minute validity
  try {
    const resetData = {
      email: normalizedEmail,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    };
    localStorage.setItem(STORAGE_KEYS.RESET_CODES, JSON.stringify(resetData));
  } catch (e) {
    console.error('Failed to save reset code:', e);
  }

  return { success: true, code };
}

export function verifyAndResetPassword(
  email: string,
  code: string,
  newPassword: string
): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCode = code.trim();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESET_CODES);
    if (!raw) {
      return { success: false, error: 'No active password reset request found.' };
    }

    const resetData = JSON.parse(raw);
    if (resetData.email !== normalizedEmail) {
      return { success: false, error: 'Reset code does not match this email.' };
    }

    if (Date.now() > resetData.expiresAt) {
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    if (resetData.code !== normalizedCode) {
      return { success: false, error: 'Invalid verification code. Please check and try again.' };
    }

    // Code matches: update password in accounts list
    const accounts = loadAccounts();
    const updated = accounts.map((acc) => {
      if (acc.user.email.toLowerCase() === normalizedEmail) {
        return {
          ...acc,
          passwordHash: newPassword
        };
      }
      return acc;
    });

    saveAccounts(updated);
    localStorage.removeItem(STORAGE_KEYS.RESET_CODES);

    return { success: true };
  } catch (e) {
    console.error('Reset verification error:', e);
    return { success: false, error: 'An unexpected error occurred while resetting password.' };
  }
}

export function signOutUser() {
  saveCurrentUser(null);
}
