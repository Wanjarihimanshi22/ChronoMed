import React, { useState } from 'react';
import {
  X,
  Volume2,
  Bell,
  Play,
  Check,
  RotateCcw,
  Sliders,
  Shield,
  Clock
} from 'lucide-react';
import { AlarmSettings } from '../utils/storage';
import { AlarmSoundTone } from '../types';
import { previewTone, stopAlarmSound } from '../utils/audioSynthesizer';

interface AlarmSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AlarmSettings;
  onSaveSettings: (settings: AlarmSettings) => void;
  onResetData: () => void;
}

export const AlarmSettingsModal: React.FC<AlarmSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetData
}) => {
  const [currentTone, setCurrentTone] = useState<AlarmSoundTone>(settings.soundTone);
  const [browserNotifications, setBrowserNotifications] = useState<boolean>(settings.browserNotifications);
  const [snoozeMins, setSnoozeMins] = useState<number>(settings.snoozeDurationMinutes);
  const [autoRefillAlerts, setAutoRefillAlerts] = useState<boolean>(settings.autoRefillAlerts);
  const [previewingTone, setPreviewingTone] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePreview = (tone: AlarmSoundTone) => {
    setPreviewingTone(tone);
    previewTone(tone);
    setTimeout(() => {
      setPreviewingTone(null);
    }, 2200);
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserNotifications(true);
      } else {
        setBrowserNotifications(false);
      }
    }
  };

  const handleSave = () => {
    stopAlarmSound();
    onSaveSettings({
      ...settings,
      soundTone: currentTone,
      browserNotifications,
      snoozeDurationMinutes: snoozeMins,
      autoRefillAlerts
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Alarms & Alert Preferences
              </h2>
              <p className="text-xs text-slate-300">
                Configure reminder chimes, notifications, and snoozes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAlarmSound();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Tone Selector with Preview buttons */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 block flex items-center gap-1.5">
              <Volume2 className="h-4 w-4 text-teal-600" />
              <span>Alarm Sound Tone (Synthesized Medical Chimes)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'gentle_chime', name: 'Gentle Chime', desc: 'Harmonic soft marimba chord' },
                { id: 'medical_pulse', name: 'Medical Pulse', desc: 'Clinical telemetry two-tone' },
                { id: 'harmonic_bell', name: 'Harmonic Bell', desc: 'Resonant meditation bell' },
                { id: 'active_alert', name: 'Active Alert', desc: 'Attentive repeating chirp' }
              ].map((t) => {
                const isSelected = currentTone === t.id;
                const isPlaying = previewingTone === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => setCurrentTone(t.id as AlarmSoundTone)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20'
                        : 'bg-slate-50 hover:bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{t.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-teal-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500">{t.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(t.id as AlarmSoundTone);
                      }}
                      title="Preview Tone"
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-teal-50 text-slate-700 hover:text-teal-700 transition-colors shadow-2xs"
                    >
                      <Play className={`h-3.5 w-3.5 ${isPlaying ? 'text-teal-600 animate-spin' : ''}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Browser Notifications */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700 mt-0.5">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Browser Push Notifications</span>
                <p className="text-[11px] text-slate-500">
                  Deliver alerts even when the tab is in the background
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRequestNotification}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                browserNotifications
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {browserNotifications ? 'Enabled' : 'Enable'}
            </button>
          </div>

          {/* Snooze Duration */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>Default Snooze Duration</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSnoozeMins(mins)}
                  className={`py-2 rounded-xl text-center font-bold border transition-colors ${
                    snoozeMins === mins
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-slate-700 font-bold block">Reset Demo Prescriptions</span>
              <p className="text-[11px] text-slate-400">Restore factory sample data and schedule</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all medication doses and vitals back to default demo state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              stopAlarmSound();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
