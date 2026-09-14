export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type FoodRelation = 'before_meal' | 'with_meal' | 'after_meal' | 'empty_stomach' | 'anytime';

export type PillShape = 'round' | 'capsule' | 'oval' | 'tablet' | 'drops' | 'liquid' | 'inhaler';

export type PillColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'white' | 'teal';

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  category: string; // e.g. "Cardiology", "Endocrinology", "Vitamins", etc.
  dosage: string; // e.g. "10mg", "500mg"
  form: PillShape;
  color: PillColor;
  frequency: string; // e.g. "Once daily", "Twice daily"
  scheduledTimes: string[]; // e.g. ["08:00", "20:00"] (HH:MM 24h format)
  timeOfDay: TimeOfDay[];
  foodRelation: FoodRelation;
  instructions: string; // e.g. "Take with a full glass of water"
  circadianBenefit?: string; // Chronotherapy medical insight
  totalInventory: number;
  remainingPills: number;
  refillThreshold: number; // e.g. 7
  prescribedBy: string;
  active: boolean;
  createdAt: string;
}

export type DoseStatus = 'taken' | 'skipped' | 'snoozed' | 'pending';

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: string; // "08:00"
  date: string; // "YYYY-MM-DD"
  timestamp: string; // ISO string when action occurred
  status: DoseStatus;
  notes?: string;
}

export interface VitalReading {
  id: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  bloodGlucose?: number; // mg/dL
  glucoseContext?: 'fasting' | 'post_prandial' | 'random';
  heartRate?: number; // bpm
  weight?: number; // kg or lbs
  waterIntakeMl?: number; // ml
  sleepHours?: number; // hours
  mood?: 'great' | 'good' | 'fair' | 'poor';
}

export interface HealthBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  targetLabel: string;
}

export interface DrugInteraction {
  id: string;
  severity: 'high' | 'moderate' | 'mild' | 'food';
  title: string;
  involvedItems: string[];
  description: string;
  recommendation: string;
}

export interface EmergencyInfo {
  patientName: string;
  dob: string;
  bloodType: string;
  allergies: string[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  primaryDoctor: string;
  clinicPhone: string;
  insuranceProvider: string;
  policyNumber: string;
  organDonor: boolean;
}

export type AlarmSoundTone = 'gentle_chime' | 'medical_pulse' | 'harmonic_bell' | 'active_alert';

export interface ActiveAlarm {
  medication: Medication;
  scheduledTime: string;
  triggeredAt: number;
  isSnoozed?: boolean;
  snoozeUntil?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  medicalRecordNumber?: string;
  emergencyPhone?: string;
  conditions?: string[];
}
