import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Plus,
  ShieldAlert,
  Clock,
  Settings,
  Sparkles,
  HeartPulse,
  Pill,
  LogOut,
  User
} from 'lucide-react';
import { AlarmSettings } from '../utils/storage';
import { getMuteState, setMuteState } from '../utils/audioSynthesizer';
import { UserProfile } from '../types';

interface HeaderProps {
  alarmSettings: AlarmSettings;
  onUpdateAlarmSettings: (settings: AlarmSettings) => void;
  onOpenAddMedication: () => void;
  onOpenEmergencyCard: () => void;
  onOpenAlarmSettings: () => void;
  onTriggerTestAlarm: () => void;
  lowRefillCount: number;
  pendingDoseCount: number;
  currentUser: UserProfile | null;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alarmSettings,
  onUpdateAlarmSettings,
  onOpenAddMedication,
  onOpenEmergencyCard,
  onOpenAlarmSettings,
  onTriggerTestAlarm,
  lowRefillCount,
  pendingDoseCount,
  currentUser,
  onSignOut
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isMuted, setIsMuted] = useState<boolean>(getMuteState());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setMuteState(nextMuted);
    setIsMuted(nextMuted);
  };

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <HeartPulse className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  ChronoMed
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                    Health Hub
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Circadian Prescriptions & Vitality Analytics
              </p>
            </div>
          </div>

          {/* Mobile Right Quick Action Icons */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onTriggerTestAlarm}
              title="Test Alarm Sound & Alert"
              className="p-2 rounded-lg text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 text-xs font-semibold"
            >
              <BellRing className="h-4 w-4 animate-bounce" />
              <span>Test</span>
            </button>
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
              title={isMuted ? 'Sound is Muted' : 'Sound is Enabled'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4 text-teal-600" />}
            </button>
          </div>
        </div>

        {/* Center Live Clock & System Status */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-100/80 px-4 py-1.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4 text-teal-600" />
            <span className="font-mono text-sm font-semibold tracking-tight">{formattedTime}</span>
            <span className="text-xs text-slate-400 font-medium">| {formattedDate}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-300" />
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-600">Alarms Active</span>
          </div>
        </div>

        {/* Right Actions Bar */}
        <div className="flex items-center flex-wrap gap-2 justify-end">
          {/* Test Alarm Simulator Button */}
          <button
            id="test-alarm-btn"
            onClick={onTriggerTestAlarm}
            title="Immediately test the audible alarm chime and interactive popup reminder"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all shadow-2xs hover:shadow-xs active:scale-95"
          >
            <BellRing className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>Test Alarm Now</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isMuted ? 'Sound is Muted - Click to Unmute' : 'Audio Alarm is On - Click to Mute'}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-teal-600" />}
          </button>

          {/* Alarm & Notification Settings */}
          <button
            onClick={onOpenAlarmSettings}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            title="Alarm & Sound Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Emergency Medical ID / ICE Card */}
          <button
            id="emergency-card-btn"
            onClick={onOpenEmergencyCard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all active:scale-95"
            title="Open In Case of Emergency Medical Card"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
            <span className="hidden sm:inline">Emergency</span> ICE
          </button>

          {/* Add Medication Action */}
          <button
            id="add-medication-header-btn"
            onClick={onOpenAddMedication}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all active:scale-95"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Medication</span>
          </button>

          {/* User Profile & Sign Out */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div
                className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100/90 text-left cursor-default"
                title={`Logged in as ${currentUser.name} (${currentUser.email})`}
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[110px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-teal-700 font-medium">
                    {currentUser.medicalRecordNumber || 'Patient'}
                  </p>
                </div>
              </div>

              <button
                id="sign-out-btn"
                onClick={onSignOut}
                title="Sign Out of ChronoMed Session"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-rose-700 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5 text-slate-500 hover:text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Notification Ticker for Pending Doses or Refills */}
      {(pendingDoseCount > 0 || lowRefillCount > 0) && (
        <div className="bg-gradient-to-r from-amber-50 via-teal-50 to-blue-50 border-t border-slate-200/80 px-4 py-1.5 text-xs text-slate-700 flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              {pendingDoseCount > 0 && (
                <span className="flex items-center gap-1 font-medium text-amber-900">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping inline-block" />
                  <span className="font-bold">{pendingDoseCount}</span> medication dose{pendingDoseCount > 1 ? 's' : ''} scheduled for today
                </span>
              )}
              {lowRefillCount > 0 && (
                <span className="hidden sm:flex items-center gap-1 font-medium text-rose-800">
                  <Pill className="h-3.5 w-3.5 text-rose-600" />
                  <span className="font-bold">{lowRefillCount}</span> prescription{lowRefillCount > 1 ? 's' : ''} low on pills (Refill needed)
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 hidden md:inline">
              Audible alarms trigger automatically at dose times
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
