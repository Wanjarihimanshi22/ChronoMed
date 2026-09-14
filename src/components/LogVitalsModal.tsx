import React, { useState } from 'react';
import {
  X,
  Heart,
  Activity,
  Droplets,
  Moon,
  Smile,
  Save,
  CheckCircle2
} from 'lucide-react';
import { VitalReading } from '../types';
import { playSuccessChime } from '../utils/audioSynthesizer';

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVital: (vital: VitalReading) => void;
  latestVital?: VitalReading;
}

export const LogVitalsModal: React.FC<LogVitalsModalProps> = ({
  isOpen,
  onClose,
  onSaveVital,
  latestVital
}) => {
  const [systolic, setSystolic] = useState<number>(latestVital?.systolicBP || 120);
  const [diastolic, setDiastolic] = useState<number>(latestVital?.diastolicBP || 80);
  const [bloodGlucose, setBloodGlucose] = useState<number>(latestVital?.bloodGlucose || 95);
  const [glucoseContext, setGlucoseContext] = useState<'fasting' | 'post_prandial' | 'random'>('fasting');
  const [heartRate, setHeartRate] = useState<number>(latestVital?.heartRate || 72);
  const [sleepHours, setSleepHours] = useState<number>(latestVital?.sleepHours || 7.5);
  const [waterIntakeMl, setWaterIntakeMl] = useState<number>(latestVital?.waterIntakeMl || 1500);
  const [mood, setMood] = useState<'great' | 'good' | 'fair' | 'poor'>('great');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const vitalRecord: VitalReading = {
      id: `vital-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      bloodGlucose: Number(bloodGlucose),
      glucoseContext,
      heartRate: Number(heartRate),
      sleepHours: Number(sleepHours),
      waterIntakeMl: Number(waterIntakeMl),
      mood
    };

    onSaveVital(vitalRecord);
    playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Heart className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Log Health Biometrics Today
              </h2>
              <p className="text-xs text-rose-100">
                Track blood pressure, glucose, and circadian vitals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Blood Pressure */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-rose-600" />
              <span>Blood Pressure (mmHg)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Systolic (Upper)</span>
                <input
                  type="number"
                  min="70"
                  max="220"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-rose-700"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block mb-1">Diastolic (Lower)</span>
                <input
                  type="number"
                  min="40"
                  max="140"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-teal-700"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              Optimal target: &lt;120/80 mmHg. Measures cardiac vascular tension.
            </p>
          </div>

          {/* Blood Glucose */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Blood Glucose (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="400"
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-cyan-700"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Measurement Context
              </label>
              <select
                value={glucoseContext}
                onChange={(e) => setGlucoseContext(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs"
              >
                <option value="fasting">Fasting (Morning)</option>
                <option value="post_prandial">Post-Meal (2 hrs)</option>
                <option value="random">Random / Daytime</option>
              </select>
            </div>
          </div>

          {/* Heart Rate & Sleep */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Resting Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="180"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1">
                Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.1"
                min="2"
                max="14"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-indigo-700"
              />
            </div>
          </div>

          {/* Mood / Energy */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              General Vitality & Energy
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'great', label: 'Great 🌟' },
                { id: 'good', label: 'Good 😊' },
                { id: 'fair', label: 'Fair 😐' },
                { id: 'poor', label: 'Fatigued 😴' }
              ].map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id as any)}
                  className={`p-2 rounded-xl text-center border font-medium transition-colors ${
                    mood === m.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Reading</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
