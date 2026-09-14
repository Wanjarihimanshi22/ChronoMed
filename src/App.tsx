/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Activity,
  Sparkles,
  ShieldAlert,
  BellRing,
  Pill,
  HeartPulse,
  Award,
  Clock
} from 'lucide-react';
import {
  Medication,
  DoseLog,
  VitalReading,
  HealthBadge,
  EmergencyInfo,
  ActiveAlarm,
  UserProfile
} from './types';
import {
  loadMedications,
  saveMedications,
  loadDoseLogs,
  saveDoseLogs,
  loadVitals,
  saveVitals,
  loadBadges,
  saveBadges,
  loadEmergencyInfo,
  saveEmergencyInfo,
  loadAlarmSettings,
  saveAlarmSettings,
  AlarmSettings,
  resetAllData,
  loadCurrentUser,
  saveCurrentUser,
  signOutUser
} from './utils/storage';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { MedicationList } from './components/MedicationList';
import { HealthProgressDashboard } from './components/HealthProgressDashboard';
import { CircadianChronotherapy } from './components/CircadianChronotherapy';
import { InteractionChecker } from './components/InteractionChecker';
import { AlarmModal } from './components/AlarmModal';
import { AddMedicationModal } from './components/AddMedicationModal';
import { LogVitalsModal } from './components/LogVitalsModal';
import { EmergencyCardModal } from './components/EmergencyCardModal';
import { AlarmSettingsModal } from './components/AlarmSettingsModal';
import { playSuccessChime } from './utils/audioSynthesizer';

export default function App() {
  // Authentication & Patient Session
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(loadCurrentUser);

  // Navigation
  const [activeTab, setActiveTab] = useState<'schedule' | 'dashboard' | 'circadian' | 'interactions'>('schedule');

  // Application Data States
  const [medications, setMedications] = useState<Medication[]>(loadMedications);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(loadDoseLogs);
  const [vitals, setVitals] = useState<VitalReading[]>(loadVitals);
  const [badges, setBadges] = useState<HealthBadge[]>(loadBadges);
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo>(loadEmergencyInfo);
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>(loadAlarmSettings);

  // Active Alarm State (Modal triggers when non-null)
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarm | null>(null);

  // Modals
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isLogVitalsOpen, setIsLogVitalsOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isAlarmSettingsOpen, setIsAlarmSettingsOpen] = useState(false);

  // Keep track of triggered alarms this minute to prevent multiple triggers
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Real-time alarm monitoring loop
  useEffect(() => {
    if (!alarmSettings.enabled) return;

    const checkAlarms = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayStr = now.toISOString().split('T')[0];

      // Find any active medication scheduled for this exact minute that hasn't been taken today
      medications.forEach((med) => {
        if (!med.active) return;
        med.scheduledTimes.forEach((time) => {
          if (time === currentTimeStr) {
            const triggerKey = `${med.id}-${todayStr}-${time}`;
            if (!triggeredAlarmsRef.current.has(triggerKey)) {
              // Check if already taken
              const alreadyTaken = doseLogs.some(
                (l) => l.medicationId === med.id && l.scheduledTime === time && l.date === todayStr && l.status === 'taken'
              );

              if (!alreadyTaken) {
                triggeredAlarmsRef.current.add(triggerKey);
                setActiveAlarm({
                  medication: med,
                  scheduledTime: time,
                  triggeredAt: Date.now()
                });
              }
            }
          }
        });
      });
    };

    const interval = setInterval(checkAlarms, 10000); // check every 10s
    return () => clearInterval(interval);
  }, [medications, doseLogs, alarmSettings.enabled]);

  // Dose Actions
  const handleTakeDose = (medicationId: string, scheduledTime: string) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const targetMed = medications.find((m) => m.id === medicationId);

    // Create or update dose log
    const existingLogIndex = doseLogs.findIndex(
      (l) => l.medicationId === medicationId && l.scheduledTime === scheduledTime && l.date === todayStr
    );

    let updatedLogs: DoseLog[];
    if (existingLogIndex >= 0) {
      updatedLogs = [...doseLogs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        status: 'taken',
        timestamp: now.toISOString()
      };
    } else {
      const newLog: DoseLog = {
        id: `log-${Date.now()}`,
        medicationId,
        medicationName: targetMed ? targetMed.name : 'Medication',
        scheduledTime,
        date: todayStr,
        timestamp: now.toISOString(),
        status: 'taken'
      };
      updatedLogs = [newLog, ...doseLogs];
    }

    setDoseLogs(updatedLogs);
    saveDoseLogs(updatedLogs);

    // Decrement pill count by 1
    const updatedMeds = medications.map((m) => {
      if (m.id === medicationId) {
        return {
          ...m,
          remainingPills: Math.max(0, m.remainingPills - 1)
        };
      }
      return m;
    });
    setMedications(updatedMeds);
    saveMedications(updatedMeds);

    // Close alarm modal if open
    setActiveAlarm(null);
  };

  const handleUndoDose = (medicationId: string, scheduledTime: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedLogs = doseLogs.filter(
      (l) => !(l.medicationId === medicationId && l.scheduledTime === scheduledTime && l.date === todayStr)
    );
    setDoseLogs(updatedLogs);
    saveDoseLogs(updatedLogs);

    // Restore pill count
    const updatedMeds = medications.map((m) => {
      if (m.id === medicationId) {
        return {
          ...m,
          remainingPills: Math.min(m.totalInventory, m.remainingPills + 1)
        };
      }
      return m;
    });
    setMedications(updatedMeds);
    saveMedications(updatedMeds);
  };

  const handleSnoozeAlarm = (alarm: ActiveAlarm, minutes: number = 5) => {
    setActiveAlarm(null);
    setTimeout(() => {
      setActiveAlarm({
        ...alarm,
        isSnoozed: true,
        triggeredAt: Date.now()
      });
    }, minutes * 60 * 1000);
  };

  const handleSkipDose = (medicationId: string, scheduledTime: string, reason?: string) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const targetMed = medications.find((m) => m.id === medicationId);

    const newLog: DoseLog = {
      id: `log-${Date.now()}`,
      medicationId,
      medicationName: targetMed ? targetMed.name : 'Medication',
      scheduledTime,
      date: todayStr,
      timestamp: now.toISOString(),
      status: 'skipped',
      notes: reason
    };

    const updatedLogs = [newLog, ...doseLogs];
    setDoseLogs(updatedLogs);
    saveDoseLogs(updatedLogs);
    setActiveAlarm(null);
  };

  // Test Alarm Simulator: Immediately triggers the alarm chime & modal
  const handleTriggerTestAlarm = () => {
    // Pick first medication
    const sampleMed = medications[0] || {
      id: 'test-med',
      name: 'Atorvastatin (Sample)',
      dosage: '20mg',
      category: 'Cholesterol / Lipid',
      form: 'oval',
      color: 'blue',
      instructions: 'Take with a glass of water.',
      circadianBenefit: 'Optimal at night: Hepatic cholesterol synthesis peaks between 12 AM - 4 AM.',
      foodRelation: 'anytime',
      remainingPills: 24,
      totalInventory: 60,
      refillThreshold: 10,
      active: true
    };

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    setActiveAlarm({
      medication: sampleMed,
      scheduledTime: timeStr,
      triggeredAt: Date.now()
    });
  };

  const handleTriggerAlarmForMed = (medication: Medication, time: string) => {
    setActiveAlarm({
      medication,
      scheduledTime: time,
      triggeredAt: Date.now()
    });
  };

  // Medication CRUD
  const handleSaveMedication = (med: Medication) => {
    const exists = medications.some((m) => m.id === med.id);
    let updated: Medication[];
    if (exists) {
      updated = medications.map((m) => (m.id === med.id ? med : m));
    } else {
      updated = [med, ...medications];
    }
    setMedications(updated);
    saveMedications(updated);
    setEditingMedication(null);
  };

  const handleDeleteMedication = (medicationId: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      const updated = medications.filter((m) => m.id !== medicationId);
      setMedications(updated);
      saveMedications(updated);
    }
  };

  const handleRefillMed = (medicationId: string, amount: number) => {
    const updated = medications.map((m) => {
      if (m.id === medicationId) {
        return {
          ...m,
          remainingPills: m.remainingPills + amount,
          totalInventory: Math.max(m.totalInventory, m.remainingPills + amount)
        };
      }
      return m;
    });
    setMedications(updated);
    saveMedications(updated);
    playSuccessChime();
  };

  // Vitals & Hydration
  const handleSaveVital = (vital: VitalReading) => {
    const updated = [...vitals, vital];
    setVitals(updated);
    saveVitals(updated);
  };

  const handleUpdateWaterIntake = (amountMl: number) => {
    const updated = [...vitals];
    if (updated.length > 0) {
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        waterIntakeMl: amountMl
      };
      setVitals(updated);
      saveVitals(updated);
    }
  };

  // Emergency Info
  const handleSaveEmergencyInfo = (info: EmergencyInfo) => {
    setEmergencyInfo(info);
    saveEmergencyInfo(info);
  };

  // Alarm Settings
  const handleSaveAlarmSettings = (settings: AlarmSettings) => {
    setAlarmSettings(settings);
    saveAlarmSettings(settings);
  };

  // Reset demo
  const handleResetData = () => {
    resetAllData();
    window.location.reload();
  };

  // Sign Out Handler
  const handleSignOut = () => {
    signOutUser();
    setCurrentUser(null);
    setActiveAlarm(null);
  };

  // If patient is not signed in, start with the Sign In screen (with Forgot Password & Registration)
  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  // Compute pending doses and refill alerts for header indicator
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTakenCount = doseLogs.filter((l) => l.date === todayStr && l.status === 'taken').length;
  let totalScheduledToday = 0;
  medications.forEach((m) => {
    if (m.active) totalScheduledToday += m.scheduledTimes.length;
  });
  const pendingDoseCount = Math.max(0, totalScheduledToday - todayTakenCount);
  const lowRefillCount = medications.filter((m) => m.remainingPills <= m.refillThreshold).length;

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Sticky Header with Clock, Alarms, Test Alarm & Emergency Button */}
      <Header
        alarmSettings={alarmSettings}
        onUpdateAlarmSettings={handleSaveAlarmSettings}
        onOpenAddMedication={() => {
          setEditingMedication(null);
          setIsAddMedOpen(true);
        }}
        onOpenEmergencyCard={() => setIsEmergencyOpen(true)}
        onOpenAlarmSettings={() => setIsAlarmSettingsOpen(true)}
        onTriggerTestAlarm={handleTriggerTestAlarm}
        lowRefillCount={lowRefillCount}
        pendingDoseCount={pendingDoseCount}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-8 overflow-x-auto scrollbar-none py-2.5">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'schedule'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Pill className="h-4 w-4" />
              <span>Today's Schedule & Alarms</span>
              {pendingDoseCount > 0 && (
                <span className="h-5 px-1.5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                  {pendingDoseCount}
                </span>
              )}
            </button>

            <button
              id="tab-progress-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Health Progress Dashboard</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-600 text-white">
                Personalized
              </span>
            </button>

            <button
              id="tab-circadian-matrix"
              onClick={() => setActiveTab('circadian')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'circadian'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="h-4 w-4 text-teal-600" />
              <span>Circadian Chronotherapy</span>
            </button>

            <button
              id="tab-safety-interactions"
              onClick={() => setActiveTab('interactions')}
              className={`flex items-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === 'interactions'
                  ? 'bg-teal-50 text-teal-700 border border-teal-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Safety & Food Interactions</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'schedule' && (
          <MedicationList
            medications={medications}
            todayLogs={doseLogs.filter((l) => l.date === todayStr)}
            onTakeDose={handleTakeDose}
            onUndoDose={handleUndoDose}
            onTriggerAlarmForMed={handleTriggerAlarmForMed}
            onRefillMed={handleRefillMed}
            onOpenAddMedication={() => {
              setEditingMedication(null);
              setIsAddMedOpen(true);
            }}
            onEditMedication={(med) => {
              setEditingMedication(med);
              setIsAddMedOpen(true);
            }}
            onDeleteMedication={handleDeleteMedication}
          />
        )}

        {activeTab === 'dashboard' && (
          <HealthProgressDashboard
            vitals={vitals}
            doseLogs={doseLogs}
            badges={badges}
            onOpenLogVitals={() => setIsLogVitalsOpen(true)}
            onUpdateWaterIntake={handleUpdateWaterIntake}
          />
        )}

        {activeTab === 'circadian' && (
          <CircadianChronotherapy medications={medications} />
        )}

        {activeTab === 'interactions' && (
          <InteractionChecker medications={medications} />
        )}
      </main>

      {/* High Priority Medication Alarm Modal (Audible chime plays while open) */}
      <AlarmModal
        alarm={activeAlarm}
        onTakeDose={handleTakeDose}
        onSnooze={handleSnoozeAlarm}
        onSkip={handleSkipDose}
        onDismiss={() => setActiveAlarm(null)}
      />

      {/* Add / Edit Medication Modal */}
      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => {
          setIsAddMedOpen(false);
          setEditingMedication(null);
        }}
        onSave={handleSaveMedication}
        editingMedication={editingMedication}
      />

      {/* Log Biometric Vitals Modal */}
      <LogVitalsModal
        isOpen={isLogVitalsOpen}
        onClose={() => setIsLogVitalsOpen(false)}
        onSaveVital={handleSaveVital}
        latestVital={vitals[vitals.length - 1]}
      />

      {/* Emergency In-Case-of-Emergency (ICE) Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        info={emergencyInfo}
        onSaveInfo={handleSaveEmergencyInfo}
        activeMedications={medications.filter((m) => m.active)}
      />

      {/* Alarm Settings & Audio Tone Modal */}
      <AlarmSettingsModal
        isOpen={isAlarmSettingsOpen}
        onClose={() => setIsAlarmSettingsOpen(false)}
        settings={alarmSettings}
        onSaveSettings={handleSaveAlarmSettings}
        onResetData={handleResetData}
      />
    </div>
  );
}
