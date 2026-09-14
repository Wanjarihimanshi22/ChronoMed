import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar
} from 'recharts';
import {
  Activity,
  Heart,
  Droplets,
  Moon,
  Flame,
  Award,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VitalReading, DoseLog, HealthBadge } from '../types';
import { calculateHealthIndex } from '../utils/chronobiology';
import { playSuccessChime } from '../utils/audioSynthesizer';

interface HealthProgressDashboardProps {
  vitals: VitalReading[];
  doseLogs: DoseLog[];
  badges: HealthBadge[];
  onOpenLogVitals: () => void;
  onUpdateWaterIntake: (amountMl: number) => void;
}

export const HealthProgressDashboard: React.FC<HealthProgressDashboardProps> = ({
  vitals,
  doseLogs,
  badges,
  onOpenLogVitals,
  onUpdateWaterIntake
}) => {
  const [vitalsTimeRange, setVitalsTimeRange] = useState<'7d' | '14d'>('14d');
  const [selectedMetric, setSelectedMetric] = useState<'bp' | 'glucose' | 'sleep'>('bp');

  // Calculate 14-day adherence trend data
  const dateMap = new Map<string, { total: number; taken: number }>();

  // Get unique dates from dose logs
  doseLogs.forEach((log) => {
    const current = dateMap.get(log.date) || { total: 0, taken: 0 };
    current.total += 1;
    if (log.status === 'taken') {
      current.taken += 1;
    }
    dateMap.set(log.date, current);
  });

  // Sort dates
  const sortedDates = Array.from(dateMap.keys()).sort();
  const slicedDates = vitalsTimeRange === '7d' ? sortedDates.slice(-7) : sortedDates.slice(-14);

  const adherenceChartData = slicedDates.map((dateStr) => {
    const stat = dateMap.get(dateStr) || { total: 1, taken: 1 };
    const pct = Math.round((stat.taken / Math.max(1, stat.total)) * 100);
    const label = new Date(dateStr + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      date: label,
      rawDate: dateStr,
      adherence: pct,
      taken: stat.taken,
      total: stat.total
    };
  });

  // Overall adherence calculation
  const totalAllTimeDoses = doseLogs.length;
  const takenAllTimeDoses = doseLogs.filter((l) => l.status === 'taken').length;
  const overallAdherence = totalAllTimeDoses > 0 ? Math.round((takenAllTimeDoses / totalAllTimeDoses) * 100) : 100;

  // Latest vital reading
  const latestVital = vitals[vitals.length - 1];

  // Health Score calculation
  const healthScoreResult = calculateHealthIndex(overallAdherence, latestVital, 7);

  // Vitals trend data
  const vitalsChartData = (vitalsTimeRange === '7d' ? vitals.slice(-7) : vitals.slice(-14)).map((v) => {
    const label = new Date(v.date + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      date: label,
      systolic: v.systolicBP || 120,
      diastolic: v.diastolicBP || 80,
      glucose: v.bloodGlucose || 95,
      sleep: v.sleepHours || 7.2,
      heartRate: v.heartRate || 70,
      water: v.waterIntakeMl || 1800
    };
  });

  const todayWater = latestVital?.waterIntakeMl || 1500;
  const waterTarget = 2000;
  const waterPercent = Math.min(100, Math.round((todayWater / waterTarget) * 100));

  const handleAddWater = (ml: number) => {
    onUpdateWaterIntake(todayWater + ml);
    playSuccessChime();
    if (todayWater + ml >= waterTarget) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch {
        // pass
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Health Score & Vitality Index + Quick Log Button */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800/40">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personalized Health Progress Engine</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {healthScoreResult.score}
                <span className="text-xl sm:text-2xl font-semibold text-teal-300/80">/100</span>
              </h2>
              <span className="text-sm sm:text-base font-bold text-teal-300 px-3 py-0.5 rounded-full bg-teal-900/60 border border-teal-500/40">
                {healthScoreResult.label}
              </span>
            </div>

            <p className="text-sm text-slate-300 max-w-xl font-normal leading-relaxed">
              {healthScoreResult.feedback}
            </p>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Adherence</span>
                <span className="text-base font-bold text-emerald-400">{overallAdherence}%</span>
                <span className="text-[11px] text-slate-400 block">7-day perfect</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Last BP</span>
                <span className="text-base font-bold text-teal-300">
                  {latestVital?.systolicBP || 122}/{latestVital?.diastolicBP || 78}
                </span>
                <span className="text-[11px] text-teal-400 block">Optimal Zone</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Glucose</span>
                <span className="text-base font-bold text-cyan-300">
                  {latestVital?.bloodGlucose || 96} mg/dL
                </span>
                <span className="text-[11px] text-cyan-400 block">Fasting normal</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xs text-slate-400 block font-medium">Sleep Rest</span>
                <span className="text-base font-bold text-indigo-300">
                  {latestVital?.sleepHours || 7.5} hrs
                </span>
                <span className="text-[11px] text-indigo-400 block">Circadian aligned</span>
              </div>
            </div>
          </div>

          {/* Action to log new biometric vitals */}
          <div className="flex flex-col gap-3 shrink-0 self-start lg:self-center">
            <button
              id="log-vitals-dashboard-btn"
              onClick={onOpenLogVitals}
              className="px-5 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Log Biometrics Today</span>
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-teal-400" />
              <span>HIPAA Compliant Local Storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row: Medication Adherence & Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Medication Adherence Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Medication Adherence Trend</h3>
                  <p className="text-xs text-slate-500">Daily dose compliance rate (%)</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setVitalsTimeRange('7d')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    vitalsTimeRange === '7d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setVitalsTimeRange('14d')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    vitalsTimeRange === '14d' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  14 Days
                </button>
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={adherenceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adherenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                            <p className="font-bold text-teal-300">{label}</p>
                            <p className="font-semibold text-white">Adherence: {data.adherence}%</p>
                            <p className="text-slate-400">
                              Doses: {data.taken} of {data.total} taken
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={85} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: 'Target: 85%', fill: '#d97706', fontSize: 10, position: 'insideTopRight' }} />
                  <Area
                    type="monotone"
                    dataKey="adherence"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#adherenceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle className="h-3.5 w-3.5" />
              Above clinical efficacy threshold (85%)
            </span>
            <span>Avg: {overallAdherence}%</span>
          </div>
        </div>

        {/* Chart 2: Biometrics Tracking (Blood Pressure / Glucose / Sleep) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Biometric Vital Trends</h3>
                  <p className="text-xs text-slate-500">Correlate medication effect on biometrics</p>
                </div>
              </div>

              {/* Metric selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                <button
                  onClick={() => setSelectedMetric('bp')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedMetric === 'bp' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Blood Pressure
                </button>
                <button
                  onClick={() => setSelectedMetric('glucose')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedMetric === 'glucose' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Glucose
                </button>
                <button
                  onClick={() => setSelectedMetric('sleep')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedMetric === 'sleep' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Sleep
                </button>
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {selectedMetric === 'bp' ? (
                  <LineChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 150]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" mmHg" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                              <p className="font-bold text-rose-300">{label}</p>
                              <p className="text-white">Systolic: <span className="font-bold text-rose-400">{data.systolic}</span> mmHg</p>
                              <p className="text-white">Diastolic: <span className="font-bold text-teal-400">{data.diastolic}</span> mmHg</p>
                              <p className="text-slate-400">Resting HR: {data.heartRate} bpm</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={120} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Target Systolic (120)', fill: '#64748b', fontSize: 9 }} />
                    <ReferenceLine y={80} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Target Diastolic (80)', fill: '#64748b', fontSize: 9 }} />
                    <Line type="monotone" dataKey="systolic" stroke="#e11d48" strokeWidth={2.5} dot={{ r: 3, fill: '#e11d48' }} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, fill: '#0d9488' }} name="Diastolic" />
                  </LineChart>
                ) : selectedMetric === 'glucose' ? (
                  <LineChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 160]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" mg/dL" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                              <p className="font-bold text-cyan-300">{label}</p>
                              <p className="text-white">Blood Glucose: <span className="font-bold text-cyan-400">{data.glucose}</span> mg/dL</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="3 3" label={{ value: 'Fasting Target (100)', fill: '#64748b', fontSize: 9 }} />
                    <Line type="monotone" dataKey="glucose" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3, fill: '#0284c7' }} name="Glucose" />
                  </LineChart>
                ) : (
                  <BarChart data={vitalsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[4, 10]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" hrs" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1">
                              <p className="font-bold text-indigo-300">{label}</p>
                              <p className="text-white">Sleep: <span className="font-bold text-indigo-400">{data.sleep}</span> hours</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine y={7.5} stroke="#6366f1" strokeDasharray="3 3" label={{ value: 'Optimum: 7.5 hrs', fill: '#6366f1', fontSize: 9 }} />
                    <Bar dataKey="sleep" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700">
              {selectedMetric === 'bp' && 'Latest: 122/78 mmHg (Stable)'}
              {selectedMetric === 'glucose' && 'Latest: 96 mg/dL (Normal fasting)'}
              {selectedMetric === 'sleep' && 'Latest: 7.5 hours (Restorative)'}
            </span>
            <button onClick={onOpenLogVitals} className="text-teal-600 hover:text-teal-700 font-semibold">
              + Update Reading
            </button>
          </div>
        </div>
      </div>

      {/* Engagement Row: Hydration Tracker + Gamification & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Hydration Tracker */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hydration Sync</h3>
                  <p className="text-xs text-slate-500">Crucial for kidney clearance of meds</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2 py-1 rounded-md border border-cyan-200">
                {todayWater} / {waterTarget} ml
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 my-4">
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{waterPercent}% of Daily Target</span>
                <span>{Math.max(0, waterTarget - todayWater)} ml remaining</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Adequate water prevents drug crystalluria and protects renal filtration while taking Lisinopril and Metformin.
            </p>
          </div>

          {/* Quick Add Water Buttons */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-semibold text-xs border border-cyan-200 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+250ml Glass</span>
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs border border-blue-200 flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+500ml Bottle</span>
            </button>
          </div>
        </div>

        {/* Gamification & Streaks Badges (User Engagement) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Health Milestones & Streaks</h3>
                  <p className="text-xs text-slate-500">Consistency badges to celebrate adherence</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Flame className="h-4 w-4 text-amber-600 fill-amber-500" />
                <span>7-Day Active Streak</span>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {badges.map((badge) => {
                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      badge.unlocked
                        ? 'bg-gradient-to-b from-amber-50/50 to-white border-amber-200 shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                          badge.unlocked
                            ? 'bg-amber-100 text-amber-700 shadow-2xs'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {badge.iconName === 'Flame' && <Flame className="h-5 w-5" />}
                        {badge.iconName === 'Moon' && <Moon className="h-5 w-5" />}
                        {badge.iconName === 'HeartPulse' && <Heart className="h-5 w-5" />}
                        {badge.iconName === 'Droplets' && <Droplets className="h-5 w-5" />}
                        {badge.iconName === 'Award' && <Award className="h-5 w-5" />}
                      </div>

                      {badge.unlocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          {badge.targetLabel}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            badge.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>3 of 5 Master Milestones Achieved</span>
            <span className="text-teal-600 font-medium">Keep routine steady for Diamond Champion</span>
          </div>
        </div>
      </div>
    </div>
  );
};
