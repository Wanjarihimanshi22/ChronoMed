import React, { useState } from 'react';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CIRCADIAN_WINDOWS } from '../utils/chronobiology';
import { Medication } from '../types';

interface CircadianChronotherapyProps {
  medications: Medication[];
}

export const CircadianChronotherapy: React.FC<CircadianChronotherapyProps> = ({
  medications
}) => {
  const [selectedWindowIdx, setSelectedWindowIdx] = useState<number>(0);

  const activeWindow = CIRCADIAN_WINDOWS[selectedWindowIdx];

  // Map user medications to their corresponding circadian windows
  const getMedsForWindow = (windowIdx: number): Medication[] => {
    return medications.filter((m) => {
      return m.scheduledTimes.some((time) => {
        const hour = parseInt(time.split(':')[0], 10);
        if (windowIdx === 0) return hour >= 5 && hour < 10;
        if (windowIdx === 1) return hour >= 11 && hour < 15;
        if (windowIdx === 2) return hour >= 17 && hour < 20;
        if (windowIdx === 3) return hour >= 20 || hour < 5;
        return false;
      });
    });
  };

  const currentWindowMeds = getMedsForWindow(selectedWindowIdx);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shadow-2xs">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Circadian Chronotherapy Matrix
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Unique ChronoMed Science
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimizing medication administration according to 24-hour biological body clocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Evidence-Based Chronopharmacology</span>
        </div>
      </div>

      {/* 4 Interactive Circadian Phases */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CIRCADIAN_WINDOWS.map((window, idx) => {
          const isSelected = selectedWindowIdx === idx;
          const matchedMeds = getMedsForWindow(idx);

          return (
            <button
              key={window.timeWindow}
              onClick={() => setSelectedWindowIdx(idx)}
              className={`text-left p-4 rounded-2xl border transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-b from-teal-50/70 to-white border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    idx === 0
                      ? 'bg-amber-100 text-amber-700'
                      : idx === 1
                      ? 'bg-orange-100 text-orange-700'
                      : idx === 2
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {idx === 0 && <Sun className="h-4 w-4" />}
                  {idx === 1 && <SunMedium className="h-4 w-4" />}
                  {idx === 2 && <Sunset className="h-4 w-4" />}
                  {idx === 3 && <Moon className="h-4 w-4" />}
                </div>

                <span className="font-mono text-[11px] font-bold text-slate-500">
                  {window.timeWindow}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-900 leading-tight">
                {window.label}
              </h3>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Scheduled:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    matchedMeds.length > 0
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {matchedMeds.length} Prescriptions
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Window Deep Dive & Chronotherapy Medical Advice */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-white text-slate-800 border border-slate-200">
              {activeWindow.timeWindow}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              {activeWindow.label} Biological Analysis
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Physiology & Enzyme Dynamics
          </span>
        </div>

        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
          <strong className="text-slate-900">Endogenous Body Rhythm: </strong>
          {activeWindow.biology}
        </p>

        {/* User's matched prescriptions in this window */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Your Active Prescriptions in This Window
          </h4>
          {currentWindowMeds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentWindowMeds.map((med) => (
                <div
                  key={med.id}
                  className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                >
                  <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{med.name}</span>
                      <span className="text-[11px] font-semibold text-teal-700">{med.dosage}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {med.circadianBenefit || `Scheduled at ${med.scheduledTimes.join(', ')}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-3.5 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500 text-center">
              No prescriptions currently scheduled in the {activeWindow.timeWindow} window.
            </div>
          )}
        </div>

        {/* Recommended drug classes for this window */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Clinical Best-Practices for {activeWindow.label}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeWindow.recommendedClasses.map((item, i) => (
              <li
                key={i}
                className="text-xs text-slate-600 bg-white/70 px-3 py-2 rounded-lg border border-slate-200/60 flex items-center gap-2"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
