import React, { useEffect, useState } from 'react';
import {
  BellRing,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  AlertTriangle,
  Info,
  Pill,
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveAlarm, Medication } from '../types';
import { startAlarmSound, stopAlarmSound, playSuccessChime, getMuteState, setMuteState } from '../utils/audioSynthesizer';

interface AlarmModalProps {
  alarm: ActiveAlarm | null;
  onTakeDose: (medicationId: string, scheduledTime: string) => void;
  onSnooze: (alarm: ActiveAlarm, minutes: number) => void;
  onSkip: (medicationId: string, scheduledTime: string, reason?: string) => void;
  onDismiss: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  alarm,
  onTakeDose,
  onSnooze,
  onSkip,
  onDismiss
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(getMuteState());
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  useEffect(() => {
    if (alarm) {
      setSecondsElapsed(0);
      startAlarmSound('gentle_chime');

      // Request browser notification if available
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`ChronoMed Reminder: ${alarm.medication.name}`, {
            body: `Time for your ${alarm.medication.dosage} dose! ${alarm.medication.instructions}`,
            icon: '/favicon.ico'
          });
        } catch {
          // pass
        }
      }

      const timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
        stopAlarmSound();
      };
    } else {
      stopAlarmSound();
    }
  }, [alarm]);

  if (!alarm) return null;

  const { medication, scheduledTime } = alarm;

  const handleMuteToggle = () => {
    const next = !isMuted;
    setMuteState(next);
    setIsMuted(next);
    if (next) {
      stopAlarmSound();
    } else {
      startAlarmSound('gentle_chime');
    }
  };

  const handleTake = () => {
    stopAlarmSound();
    playSuccessChime();
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // pass
    }
    onTakeDose(medication.id, scheduledTime);
  };

  const handleSnooze = (minutes: number = 5) => {
    stopAlarmSound();
    onSnooze(alarm, minutes);
  };

  const handleSkip = () => {
    stopAlarmSound();
    onSkip(medication.id, scheduledTime, 'User skipped from alarm');
  };

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Color mapping for pill visual preview
  const pillColorClasses: Record<string, string> = {
    blue: 'bg-blue-500 text-white',
    red: 'bg-red-500 text-white',
    green: 'bg-emerald-500 text-white',
    yellow: 'bg-amber-400 text-amber-950',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
    white: 'bg-white text-slate-800 border border-slate-300',
    teal: 'bg-teal-500 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-2 border-teal-500 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Pulsating Alarm Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center h-10 w-10 rounded-full bg-white/20 ring-4 ring-white/30 animate-pulse">
              <BellRing className="h-5 w-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Medication Alarm Ringing
                </span>
                <span className="font-mono text-xs font-semibold bg-black/20 px-2 py-0.5 rounded-md">
                  +{formatElapsed(secondsElapsed)}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                Dose Due: {scheduledTime}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute alarm' : 'Silence alarm sound'}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <button
              onClick={() => {
                stopAlarmSound();
                onDismiss();
              }}
              title="Close modal"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Medication Details */}
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              {/* Pill visual indicator */}
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold shadow-xs ${
                  pillColorClasses[medication.color] || 'bg-teal-500 text-white'
                }`}
              >
                <Pill className="h-6 w-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {medication.name}
                </h3>
                <p className="text-sm font-semibold text-teal-700">
                  {medication.dosage} • {medication.category}
                </p>
                {medication.genericName && (
                  <p className="text-xs text-slate-500">
                    Generic: {medication.genericName}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-teal-100 text-teal-800">
                {medication.foodRelation.replace('_', ' ')}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                {medication.remainingPills} pills left in bottle
              </p>
            </div>
          </div>

          {/* Special Instructions & Circadian Chronotherapy Benefit */}
          <div className="space-y-2.5">
            {medication.instructions && (
              <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-amber-50/80 border border-amber-200/80 rounded-lg p-3">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-900">Administration Note: </span>
                  {medication.instructions}
                </div>
              </div>
            )}

            {medication.circadianBenefit && (
              <div className="flex items-start gap-2.5 text-xs text-slate-700 bg-teal-50 border border-teal-200 rounded-lg p-3">
                <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-teal-900">Circadian Biological Timing: </span>
                  {medication.circadianBenefit}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              id="alarm-modal-take-btn"
              onClick={handleTake}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-base shadow-md shadow-teal-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>Mark as Taken (Log Dose)</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleSnooze(5)}
                className="py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="h-4 w-4 text-slate-500" />
                <span>Snooze (5 Mins)</span>
              </button>

              <button
                onClick={handleSkip}
                className="py-2.5 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span>Skip This Dose</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
