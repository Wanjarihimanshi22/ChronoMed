import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Search,
  BellRing,
  RotateCcw,
  Sparkles,
  Package,
  Calendar,
  Utensils,
  ChevronRight,
  Edit2,
  Trash2
} from 'lucide-react';
import { Medication, DoseLog, TimeOfDay } from '../types';

interface MedicationListProps {
  medications: Medication[];
  todayLogs: DoseLog[];
  onTakeDose: (medicationId: string, scheduledTime: string) => void;
  onUndoDose: (medicationId: string, scheduledTime: string) => void;
  onTriggerAlarmForMed: (medication: Medication, time: string) => void;
  onRefillMed: (medicationId: string, amount: number) => void;
  onOpenAddMedication: () => void;
  onEditMedication: (medication: Medication) => void;
  onDeleteMedication: (medicationId: string) => void;
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  todayLogs,
  onTakeDose,
  onUndoDose,
  onTriggerAlarmForMed,
  onRefillMed,
  onOpenAddMedication,
  onEditMedication,
  onDeleteMedication
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map of doseKey ("medId-time") -> DoseLog
  const todayLogMap = new Map<string, DoseLog>();
  todayLogs.forEach((log) => {
    todayLogMap.set(`${log.medicationId}-${log.scheduledTime}`, log);
  });

  // Expand medications into individual scheduled dose entries for today
  interface DoseItem {
    medication: Medication;
    scheduledTime: string;
    timeOfDay: TimeOfDay;
    log?: DoseLog;
  }

  const allDoses: DoseItem[] = [];
  medications.forEach((med) => {
    if (!med.active) return;
    med.scheduledTimes.forEach((time) => {
      // Determine time of day from time string
      const hour = parseInt(time.split(':')[0], 10);
      let tod: TimeOfDay = 'morning';
      if (hour >= 12 && hour < 17) tod = 'afternoon';
      else if (hour >= 17 && hour < 21) tod = 'evening';
      else if (hour >= 21 || hour < 6) tod = 'night';

      allDoses.push({
        medication: med,
        scheduledTime: time,
        timeOfDay: tod,
        log: todayLogMap.get(`${med.id}-${time}`)
      });
    });
  });

  // Sort chronologically by scheduled time
  allDoses.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  // Filter doses
  const filteredDoses = allDoses.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.medication.name.toLowerCase().includes(q);
      const matchGeneric = item.medication.genericName?.toLowerCase().includes(q);
      const matchCategory = item.medication.category.toLowerCase().includes(q);
      if (!matchName && !matchGeneric && !matchCategory) return false;
    }

    // Time filter
    if (activeFilter === 'morning') return item.timeOfDay === 'morning';
    if (activeFilter === 'afternoon') return item.timeOfDay === 'afternoon';
    if (activeFilter === 'evening') return item.timeOfDay === 'evening';
    if (activeFilter === 'night') return item.timeOfDay === 'night';
    if (activeFilter === 'pending') return !item.log || item.log.status !== 'taken';
    if (activeFilter === 'taken') return item.log?.status === 'taken';
    if (activeFilter === 'low_refill') return item.medication.remainingPills <= item.medication.refillThreshold;

    return true;
  });

  const totalToday = allDoses.length;
  const takenToday = allDoses.filter((d) => d.log?.status === 'taken').length;
  const adherencePercent = totalToday > 0 ? Math.round((takenToday / totalToday) * 100) : 0;

  const pillColorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    red: 'bg-rose-100 text-rose-800 border-rose-300',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    yellow: 'bg-amber-100 text-amber-900 border-amber-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    white: 'bg-slate-100 text-slate-800 border-slate-300',
    teal: 'bg-teal-100 text-teal-800 border-teal-300'
  };

  return (
    <div className="space-y-4">
      {/* Daily Adherence Quick Strip */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center h-14 w-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 font-bold text-lg">
            {adherencePercent}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Today's Medication Schedule</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                {takenToday} of {totalToday} taken
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {adherencePercent === 100
                ? '🎉 Incredible! All daily medications logged on schedule.'
                : 'Keep blood concentration stable by taking doses on time.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onOpenAddMedication}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Medicine</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Doses' },
            { id: 'morning', label: 'Morning' },
            { id: 'afternoon', label: 'Afternoon' },
            { id: 'evening', label: 'Evening' },
            { id: 'night', label: 'Bedtime' },
            { id: 'pending', label: 'Pending' },
            { id: 'taken', label: 'Taken' },
            { id: 'low_refill', label: 'Low Supply' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search medicine or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Medication Doses Grid / List */}
      {filteredDoses.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Pill className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Medications Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No medication doses match your current filter. Try selecting "All Doses" or add a new prescription.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          {filteredDoses.map((item) => {
            const { medication, scheduledTime, log } = item;
            const isTaken = log?.status === 'taken';
            const isLowRefill = medication.remainingPills <= medication.refillThreshold;

            return (
              <div
                key={`${medication.id}-${scheduledTime}`}
                className={`bg-white rounded-2xl p-4 border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isTaken
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                    : 'border-slate-200 hover:border-teal-300 shadow-xs'
                }`}
              >
                {/* Header row: Time & Status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-teal-600" />
                        {scheduledTime}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 capitalize">
                        {item.timeOfDay}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isTaken ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Taken
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="h-3 w-3 text-amber-600 animate-spin" />
                          Due
                        </span>
                      )}

                      {/* Edit / Delete menu */}
                      <button
                        onClick={() => onEditMedication(medication)}
                        title="Edit Prescription"
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteMedication(medication.id)}
                        title="Delete Medication"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main Pill Content */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border ${
                        pillColorClasses[medication.color] || 'bg-teal-100 text-teal-800'
                      }`}
                      title={`${medication.color} ${medication.form}`}
                    >
                      <Pill className="h-5 w-5 stroke-[2]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {medication.name}
                        </h3>
                        <span className="text-xs font-bold text-teal-700 shrink-0">
                          {medication.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        {medication.category} {medication.genericName && `• ${medication.genericName}`}
                      </p>

                      {/* Instructions & Food tag */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          <Utensils className="h-3 w-3 text-slate-500" />
                          {medication.foodRelation.replace('_', ' ')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          <Package className="h-3 w-3 text-slate-500" />
                          {medication.remainingPills} pills left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Circadian Benefit highlight (Unique differentiator) */}
                  {medication.circadianBenefit && (
                    <div className="mt-3 p-2 rounded-lg bg-teal-50/70 border border-teal-100 text-[11px] text-teal-900 flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{medication.circadianBenefit}</span>
                    </div>
                  )}

                  {/* Low Refill Alert Banner */}
                  {isLowRefill && (
                    <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        <span className="font-semibold">Low Supply ({medication.remainingPills} left)</span>
                      </div>
                      <button
                        onClick={() => onRefillMed(medication.id, 30)}
                        className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] transition-colors"
                      >
                        Refill (+30)
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onTriggerAlarmForMed(medication, scheduledTime)}
                      title="Test alarm chime and alert popup for this medication"
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center gap-1 transition-colors"
                    >
                      <BellRing className="h-3.5 w-3.5 text-amber-600" />
                      <span>Test Alarm</span>
                    </button>
                  </div>

                  <div>
                    {isTaken ? (
                      <button
                        onClick={() => onUndoDose(medication.id, scheduledTime)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Undo Dose</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onTakeDose(medication.id, scheduledTime)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Take Dose Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
