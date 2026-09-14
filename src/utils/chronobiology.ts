import { Medication, VitalReading, DoseLog, HealthBadge, DrugInteraction, EmergencyInfo } from '../types';

export interface CircadianSlot {
  timeWindow: string; // "06:00 - 09:00"
  label: string; // "Morning Awakening"
  icon: string;
  biology: string;
  recommendedClasses: string[];
}

export const CIRCADIAN_WINDOWS: CircadianSlot[] = [
  {
    timeWindow: '06:00 - 09:00',
    label: 'Morning Cortisol Rise',
    icon: 'Sun',
    biology: 'Body temperature and cortisol surge; blood pressure naturally ramps up.',
    recommendedClasses: [
      'Thyroid Hormone (Levothyroxine) - take 30-60 min before breakfast',
      'Diuretics (Water pills) - avoid nighttime urination disruption',
      'Morning Multivitamins (B-Complex, Vitamin C)'
    ]
  },
  {
    timeWindow: '12:00 - 14:00',
    label: 'Midday Metabolic Peak',
    icon: 'SunMedium',
    biology: 'Digestive enzyme secretions peak; optimal nutrient assimilation.',
    recommendedClasses: [
      'Fat-soluble vitamins (Vitamin D3, Omega-3, CoQ10) with food',
      'Midday insulin or oral hypoglycemics with lunch',
      'Probiotics with midday fiber meal'
    ]
  },
  {
    timeWindow: '18:00 - 20:00',
    label: 'Evening Digestion & Wind Down',
    icon: 'Sunset',
    biology: 'Metabolism begins tapering, vascular resistance settles.',
    recommendedClasses: [
      'Short-acting NSAIDs or arthritis relief (reduces morning stiffness)',
      'Dinner-time cardiovascular supplements',
      'Acid reflux blockers (H2 blockers before dinner)'
    ]
  },
  {
    timeWindow: '21:00 - 23:00',
    label: 'Nocturnal Repair & Melatonin Surge',
    icon: 'Moon',
    biology: 'Hepatic HMG-CoA reductase (cholesterol synthesis) peaks at night; nocturnal blood pressure dipping occurs.',
    recommendedClasses: [
      'Statins (Atorvastatin, Simvastatin) - maximum nocturnal liver efficacy',
      'Bedtime Blood Pressure meds (ACE inhibitors/ARBs for nocturnal dipping)',
      'Magnesium Glycinate / Sleep aids'
    ]
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin',
    genericName: 'Lipitor',
    category: 'Cholesterol / Lipid',
    dosage: '20mg',
    form: 'oval',
    color: 'blue',
    frequency: 'Once daily at bedtime',
    scheduledTimes: ['21:30'],
    timeOfDay: ['night'],
    foodRelation: 'anytime',
    instructions: 'Take in the evening with a glass of water.',
    circadianBenefit: 'Optimal at night: Hepatic cholesterol synthesis peaks between 12 AM - 4 AM.',
    totalInventory: 60,
    remainingPills: 42,
    refillThreshold: 10,
    prescribedBy: 'Dr. Sarah Jenkins (Cardiology)',
    active: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'med-2',
    name: 'Lisinopril',
    genericName: 'Prinivil',
    category: 'Cardiovascular / BP',
    dosage: '10mg',
    form: 'round',
    color: 'yellow',
    frequency: 'Once daily',
    scheduledTimes: ['08:00'],
    timeOfDay: ['morning'],
    foodRelation: 'with_meal',
    instructions: 'Take each morning with breakfast.',
    circadianBenefit: 'Morning dosing controls early morning blood pressure surge (cardiac peak risk window).',
    totalInventory: 90,
    remainingPills: 8, // Triggers refill warning!
    refillThreshold: 10,
    prescribedBy: 'Dr. Sarah Jenkins (Cardiology)',
    active: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'med-3',
    name: 'Metformin HCl',
    genericName: 'Glucophage',
    category: 'Endocrinology / Glucose',
    dosage: '500mg',
    form: 'capsule',
    color: 'white',
    frequency: 'Twice daily with meals',
    scheduledTimes: ['08:30', '19:00'],
    timeOfDay: ['morning', 'evening'],
    foodRelation: 'with_meal',
    instructions: 'Take with morning and evening meals to minimize GI discomfort.',
    circadianBenefit: 'Coincides with post-prandial glycemic excursions.',
    totalInventory: 120,
    remainingPills: 68,
    refillThreshold: 14,
    prescribedBy: 'Dr. Michael Chen (Endocrinology)',
    active: true,
    createdAt: '2026-08-10'
  },
  {
    id: 'med-4',
    name: 'Vitamin D3 + K2',
    genericName: 'Cholecalciferol',
    category: 'Vitamins & Supplements',
    dosage: '2000 IU',
    form: 'drops',
    color: 'teal',
    frequency: 'Once daily with lunch',
    scheduledTimes: ['12:30'],
    timeOfDay: ['afternoon'],
    foodRelation: 'with_meal',
    instructions: 'Take with a dietary fat-containing meal for up to 50% higher absorption.',
    circadianBenefit: 'Midday sunlight synchronizer; avoids evening melatonin disruption.',
    totalInventory: 90,
    remainingPills: 55,
    refillThreshold: 10,
    prescribedBy: 'Dr. Sarah Jenkins',
    active: true,
    createdAt: '2026-08-15'
  },
  {
    id: 'med-5',
    name: 'Levothyroxine',
    genericName: 'Synthroid',
    category: 'Thyroid Care',
    dosage: '50mcg',
    form: 'tablet',
    color: 'purple',
    frequency: 'Once daily upon waking',
    scheduledTimes: ['07:00'],
    timeOfDay: ['morning'],
    foodRelation: 'empty_stomach',
    instructions: 'Take 30-60 min before breakfast or coffee with a full glass of water.',
    circadianBenefit: 'Crucial empty-stomach timing; calcium and coffee block gut absorption.',
    totalInventory: 30,
    remainingPills: 22,
    refillThreshold: 7,
    prescribedBy: 'Dr. Michael Chen',
    active: true,
    createdAt: '2026-08-20'
  }
];

export const INITIAL_DOSE_LOGS: DoseLog[] = [
  // Today's logs (simulated date)
  {
    id: 'log-1',
    medicationId: 'med-5',
    medicationName: 'Levothyroxine',
    scheduledTime: '07:00',
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    status: 'taken'
  },
  {
    id: 'log-2',
    medicationId: 'med-2',
    medicationName: 'Lisinopril',
    scheduledTime: '08:00',
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    status: 'taken'
  },
  {
    id: 'log-3',
    medicationId: 'med-3',
    medicationName: 'Metformin HCl',
    scheduledTime: '08:30',
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date(Date.now() - 3600 * 1000 * 2.5).toISOString(),
    status: 'taken'
  }
];

// Helper to generate 14-day history for rich visualization charts
export function generateInitialVitalsAndLogs(): { vitals: VitalReading[]; logs: DoseLog[] } {
  const vitals: VitalReading[] = [];
  const logs: DoseLog[] = [...INITIAL_DOSE_LOGS];
  const now = new Date();

  // Generate 14 days of realistic vitals and adherence logs
  for (let i = 14; i >= 1; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];

    // Systolic 118-128, Diastolic 74-82
    const systolic = Math.floor(118 + Math.sin(i * 0.7) * 6 + (Math.random() * 4));
    const diastolic = Math.floor(75 + Math.cos(i * 0.7) * 4 + (Math.random() * 3));
    const bloodGlucose = Math.floor(94 + Math.sin(i * 0.9) * 8 + (Math.random() * 5));
    const heartRate = Math.floor(68 + Math.sin(i * 0.5) * 5 + (Math.random() * 4));
    const sleepHours = Number((7.0 + Math.sin(i * 1.1) * 0.8 + (Math.random() * 0.5)).toFixed(1));
    const waterIntakeMl = Math.floor(1800 + Math.sin(i * 0.8) * 400 + (Math.random() * 200));

    vitals.push({
      id: `vital-${dateStr}`,
      date: dateStr,
      time: '08:15',
      systolicBP: systolic,
      diastolicBP: diastolic,
      bloodGlucose: bloodGlucose,
      glucoseContext: 'fasting',
      heartRate: heartRate,
      waterIntakeMl: waterIntakeMl,
      sleepHours: sleepHours,
      mood: i % 4 === 0 ? 'great' : 'good'
    });

    // Generate past medication adherence logs
    INITIAL_MEDICATIONS.forEach((med) => {
      med.scheduledTimes.forEach((time) => {
        // High adherence with 1 or 2 historical skips
        const isSkipped = (i === 4 && med.id === 'med-1') || (i === 9 && med.id === 'med-3');
        logs.push({
          id: `hist-${med.id}-${dateStr}-${time}`,
          medicationId: med.id,
          medicationName: med.name,
          scheduledTime: time,
          date: dateStr,
          timestamp: `${dateStr}T${time}:00Z`,
          status: isSkipped ? 'skipped' : 'taken'
        });
      });
    });
  }

  // Today's vital reading
  vitals.push({
    id: `vital-today`,
    date: now.toISOString().split('T')[0],
    time: '08:00',
    systolicBP: 122,
    diastolicBP: 78,
    bloodGlucose: 96,
    glucoseContext: 'fasting',
    heartRate: 71,
    waterIntakeMl: 1500,
    sleepHours: 7.5,
    mood: 'great'
  });

  return { vitals, logs };
}

export const INITIAL_BADGES: HealthBadge[] = [
  {
    id: 'b-1',
    title: '7-Day Adherence Streak',
    description: 'Logged 100% of required medication doses for 7 consecutive days',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: 'Yesterday',
    progress: 100,
    targetLabel: '7 / 7 Days'
  },
  {
    id: 'b-2',
    title: 'Circadian Master',
    description: 'Took statins and evening medications within the optimal chronotherapy window',
    iconName: 'Moon',
    unlocked: true,
    unlockedAt: '3 days ago',
    progress: 100,
    targetLabel: 'Mastered'
  },
  {
    id: 'b-3',
    title: 'Vitality Guardian',
    description: 'Maintained optimal Blood Pressure (<130/85 mmHg) over 14 tracked days',
    iconName: 'HeartPulse',
    unlocked: true,
    unlockedAt: 'Today',
    progress: 100,
    targetLabel: '14 Days Safe'
  },
  {
    id: 'b-4',
    title: 'Hydration Hero',
    description: 'Reached 2000ml daily target 5 times this week',
    iconName: 'Droplets',
    unlocked: false,
    progress: 80,
    targetLabel: '4 / 5 Days'
  },
  {
    id: 'b-5',
    title: '30-Day Diamond Champion',
    description: 'Complete 30 days of seamless prescription tracking without an unaddressed dose',
    iconName: 'Award',
    unlocked: false,
    progress: 46,
    targetLabel: '14 / 30 Days'
  }
];

export const KNOWN_INTERACTIONS: DrugInteraction[] = [
  {
    id: 'int-1',
    severity: 'food',
    title: 'Atorvastatin & Grapefruit / Citrus Warning',
    involvedItems: ['Atorvastatin', 'Grapefruit Juice'],
    description: 'Grapefruit contains furanocoumarins which inhibit CYP3A4 enzymes, causing statin concentration in the bloodstream to surge up to 3x, increasing risk of muscle toxicity (myopathy).',
    recommendation: 'Avoid consuming whole grapefruit or grapefruit juice while taking Atorvastatin. Oranges and lemons are safe alternatives.'
  },
  {
    id: 'int-2',
    severity: 'moderate',
    title: 'Lisinopril & Potassium-Rich Diets',
    involvedItems: ['Lisinopril', 'Potassium Supplements / Salt Substitutes'],
    description: 'ACE inhibitors like Lisinopril decrease potassium excretion via the kidneys, which can cause hyperkalemia if paired with high-dose potassium supplements.',
    recommendation: 'Check with your physician before using potassium chloride salt substitutes. Routine blood electrolyte labs are advised.'
  },
  {
    id: 'int-3',
    severity: 'food',
    title: 'Levothyroxine Absorption Interference',
    involvedItems: ['Levothyroxine', 'Coffee & Calcium-Fortified Foods'],
    description: 'Caffeine, milk, and calcium carbonate bind with levothyroxine in the upper GI tract, reducing absorption by up to 40%.',
    recommendation: 'Strictly wait 30 to 60 minutes after taking your Levothyroxine pill before drinking morning coffee, tea, or eating breakfast.'
  }
];

export const INITIAL_EMERGENCY_INFO: EmergencyInfo = {
  patientName: 'Himanshi Wanjari',
  dob: '1996-05-18',
  bloodType: 'O Positive (O+)',
  allergies: ['Penicillin (Severe Rash)', 'Sulfa Drugs', 'Tree Nuts'],
  emergencyContactName: 'Rajesh Wanjari',
  emergencyContactPhone: '+1 (555) 234-8910',
  emergencyContactRelation: 'Spouse / Primary Emergency Contact',
  primaryDoctor: 'Dr. Sarah Jenkins, MD (Cardiologist)',
  clinicPhone: '+1 (555) 890-1234',
  insuranceProvider: 'BlueShield Premier Care',
  policyNumber: 'BSP-9842104-A',
  organDonor: true
};

/**
 * Calculates a personalized ChronoMed Health Index Score (0 - 100)
 */
export function calculateHealthIndex(
  adherenceRate: number, // 0 to 100
  latestVital?: VitalReading,
  streakDays: number = 7
): { score: number; label: string; color: string; feedback: string } {
  // Base weights: Adherence (45%), BP Stability (25%), Glucose/Vitals (15%), Hydration & Sleep (15%)
  let score = adherenceRate * 0.45;

  if (latestVital) {
    // BP factor
    if (latestVital.systolicBP && latestVital.diastolicBP) {
      if (latestVital.systolicBP <= 125 && latestVital.diastolicBP <= 82) {
        score += 25;
      } else if (latestVital.systolicBP <= 135 && latestVital.diastolicBP <= 88) {
        score += 20;
      } else {
        score += 12;
      }
    } else {
      score += 18;
    }

    // Glucose factor
    if (latestVital.bloodGlucose) {
      if (latestVital.bloodGlucose >= 70 && latestVital.bloodGlucose <= 105) {
        score += 15;
      } else if (latestVital.bloodGlucose <= 125) {
        score += 11;
      } else {
        score += 7;
      }
    } else {
      score += 12;
    }

    // Hydration & sleep
    const sleepFactor = Math.min(1, (latestVital.sleepHours || 7) / 7.5);
    const waterFactor = Math.min(1, (latestVital.waterIntakeMl || 1500) / 2000);
    score += (sleepFactor * 7.5) + (waterFactor * 7.5);
  } else {
    score += 45; // Default healthy assumption
  }

  // Streak bonus (up to 5 extra points capped at 100)
  score = Math.min(100, Math.round(score + Math.min(5, streakDays * 0.5)));

  if (score >= 90) {
    return {
      score,
      label: 'Optimal Vitality',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      feedback: 'Outstanding adherence and biometric stability! Your circadian alignment is in top harmony.'
    };
  } else if (score >= 78) {
    return {
      score,
      label: 'Good Health Rhythm',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      feedback: 'Solid routine! Taking evening medications on time will boost your cardiovascular protection.'
    };
  } else if (score >= 60) {
    return {
      score,
      label: 'Moderate Balance',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      feedback: 'A few missed doses detected. Setting audible alarm reminders will help maintain steady drug plasma levels.'
    };
  } else {
    return {
      score,
      label: 'Needs Attention',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      feedback: 'Low medication consistency can trigger rebound blood pressure. Please review pending doses.'
    };
  }
}
