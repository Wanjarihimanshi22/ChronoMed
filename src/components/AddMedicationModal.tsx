import React, { useState, useEffect } from 'react';
import {
  X,
  Pill,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Utensils,
  Package,
  Shield,
  Check
} from 'lucide-react';
import { Medication, PillShape, PillColor, FoodRelation, TimeOfDay } from '../types';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Medication) => void;
  editingMedication?: Medication | null;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMedication
}) => {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Cardiology');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<PillShape>('capsule');
  const [color, setColor] = useState<PillColor>('teal');
  const [frequency, setFrequency] = useState('Once daily');
  const [scheduledTimes, setScheduledTimes] = useState<string[]>(['08:00']);
  const [foodRelation, setFoodRelation] = useState<FoodRelation>('with_meal');
  const [instructions, setInstructions] = useState('');
  const [circadianBenefit, setCircadianBenefit] = useState('');
  const [totalInventory, setTotalInventory] = useState(60);
  const [remainingPills, setRemainingPills] = useState(45);
  const [refillThreshold, setRefillThreshold] = useState(10);
  const [prescribedBy, setPrescribedBy] = useState('Dr. Sarah Jenkins');

  useEffect(() => {
    if (editingMedication) {
      setName(editingMedication.name);
      setGenericName(editingMedication.genericName || '');
      setCategory(editingMedication.category);
      setDosage(editingMedication.dosage);
      setForm(editingMedication.form);
      setColor(editingMedication.color);
      setFrequency(editingMedication.frequency);
      setScheduledTimes(editingMedication.scheduledTimes);
      setFoodRelation(editingMedication.foodRelation);
      setInstructions(editingMedication.instructions);
      setCircadianBenefit(editingMedication.circadianBenefit || '');
      setTotalInventory(editingMedication.totalInventory);
      setRemainingPills(editingMedication.remainingPills);
      setRefillThreshold(editingMedication.refillThreshold);
      setPrescribedBy(editingMedication.prescribedBy);
    } else {
      // Defaults for a new medication
      setName('');
      setGenericName('');
      setCategory('Cardiology');
      setDosage('10mg');
      setForm('capsule');
      setColor('teal');
      setFrequency('Once daily');
      setScheduledTimes(['08:00']);
      setFoodRelation('with_meal');
      setInstructions('Take with water after breakfast.');
      setCircadianBenefit('Morning dosing supports natural circadian blood pressure regulation.');
      setTotalInventory(60);
      setRemainingPills(50);
      setRefillThreshold(10);
      setPrescribedBy('Dr. Sarah Jenkins');
    }
  }, [editingMedication, isOpen]);

  if (!isOpen) return null;

  const handleAddTime = () => {
    setScheduledTimes([...scheduledTimes, '20:00']);
  };

  const handleRemoveTime = (index: number) => {
    if (scheduledTimes.length <= 1) return;
    setScheduledTimes(scheduledTimes.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, val: string) => {
    const updated = [...scheduledTimes];
    updated[index] = val;
    setScheduledTimes(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    // Calculate times of day
    const timeOfDay: TimeOfDay[] = scheduledTimes.map((t) => {
      const hour = parseInt(t.split(':')[0], 10);
      if (hour >= 12 && hour < 17) return 'afternoon';
      if (hour >= 17 && hour < 21) return 'evening';
      if (hour >= 21 || hour < 6) return 'night';
      return 'morning';
    });

    const newMed: Medication = {
      id: editingMedication ? editingMedication.id : `med-${Date.now()}`,
      name: name.trim(),
      genericName: genericName.trim() || undefined,
      category,
      dosage: dosage.trim(),
      form,
      color,
      frequency,
      scheduledTimes,
      timeOfDay,
      foodRelation,
      instructions: instructions.trim(),
      circadianBenefit: circadianBenefit.trim() || undefined,
      totalInventory: Number(totalInventory),
      remainingPills: Number(remainingPills),
      refillThreshold: Number(refillThreshold),
      prescribedBy: prescribedBy.trim() || 'Primary Care Physician',
      active: true,
      createdAt: editingMedication ? editingMedication.createdAt : new Date().toISOString().split('T')[0]
    };

    onSave(newMed);
    onClose();
  };

  const pillColorClasses: Record<PillColor, string> = {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Pill className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {editingMedication ? 'Edit Prescription' : 'Add Medication & Set Alarm'}
              </h2>
              <p className="text-xs text-teal-100">
                Configure timing, dosage, reminders, and circadian guidelines
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Medication Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Medication Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lisinopril, Metformin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Dosage & Strength *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10mg, 500mg, 2000 IU"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Generic Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Generic Name / Active Ingredient
              </label>
              <input
                type="text"
                placeholder="e.g. Prinivil, Lipitor"
                value={genericName}
                onChange={(e) => setGenericName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Clinical Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-white"
              >
                <option value="Cardiovascular / BP">Cardiovascular / BP</option>
                <option value="Cholesterol / Lipid">Cholesterol / Lipid</option>
                <option value="Endocrinology / Glucose">Endocrinology / Glucose</option>
                <option value="Thyroid Care">Thyroid Care</option>
                <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                <option value="Respiratory / Inhaler">Respiratory / Inhaler</option>
                <option value="Neurology / Pain">Neurology / Pain</option>
                <option value="Gastrointestinal">Gastrointestinal</option>
                <option value="General Health">General Health</option>
              </select>
            </div>
          </div>

          {/* Visual Appearance Preview: Shape & Color */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Pill Visual Tag</span>
              {/* Preview badge */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Preview:</span>
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs ${pillColorClasses[color]}`}
                >
                  <Pill className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Form / Shape</label>
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value as PillShape)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="capsule">Capsule</option>
                  <option value="round">Round Tablet</option>
                  <option value="oval">Oval Tablet</option>
                  <option value="tablet">Caplet</option>
                  <option value="drops">Liquid Drops</option>
                  <option value="inhaler">Inhaler</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Color</label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value as PillColor)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="teal">Teal</option>
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="white">White</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Times & Reminder Alarms */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                <span>Scheduled Dose Times (Audible Alarm)</span>
              </label>
              <button
                type="button"
                onClick={handleAddTime}
                className="text-teal-700 hover:text-teal-800 font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                <span>Add Another Time</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scheduledTimes.map((time, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => handleTimeChange(idx, e.target.value)}
                    className="w-full p-1 bg-white border border-slate-200 rounded-lg font-mono text-xs font-semibold"
                  />
                  {scheduledTimes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Food Relation */}
          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <Utensils className="h-3.5 w-3.5 text-teal-600" />
              <span>Meal Relationship</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'with_meal', label: 'With Meals' },
                { id: 'before_meal', label: 'Before Meals' },
                { id: 'after_meal', label: 'After Meals' },
                { id: 'empty_stomach', label: 'Empty Stomach' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setFoodRelation(opt.id as FoodRelation)}
                  className={`p-2 rounded-xl text-center font-medium border transition-colors ${
                    foodRelation === opt.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Circadian Benefit & Instructions */}
          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span>Circadian Chronotherapy Timing Advantage</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Taking at bedtime optimizes liver HMG-CoA reductase suppression."
                value={circadianBenefit}
                onChange={(e) => setCircadianBenefit(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Special Administration Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Drink a full 250ml glass of water. Do not crush or chew."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          {/* Inventory & Refill Alert */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Bottle</label>
              <input
                type="number"
                min="1"
                value={totalInventory}
                onChange={(e) => setTotalInventory(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Pills Remaining</label>
              <input
                type="number"
                min="0"
                value={remainingPills}
                onChange={(e) => setRemainingPills(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Refill Alert At</label>
              <input
                type="number"
                min="1"
                value={refillThreshold}
                onChange={(e) => setRefillThreshold(Number(e.target.value))}
                className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Prescribing Doctor */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Prescribing Doctor</label>
            <input
              type="text"
              placeholder="e.g. Dr. Sarah Jenkins (Cardiology)"
              value={prescribedBy}
              onChange={(e) => setPrescribedBy(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 transition-all active:scale-95"
            >
              {editingMedication ? 'Save Prescription' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
