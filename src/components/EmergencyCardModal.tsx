import React, { useState } from 'react';
import {
  ShieldAlert,
  X,
  Phone,
  User,
  Heart,
  AlertCircle,
  FileText,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar
} from 'lucide-react';
import { EmergencyInfo, Medication } from '../types';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  info: EmergencyInfo;
  onSaveInfo: (info: EmergencyInfo) => void;
  activeMedications: Medication[];
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({
  isOpen,
  onClose,
  info,
  onSaveInfo,
  activeMedications
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmergencyInfo>(info);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `
EMERGENCY MEDICAL ID (ChronoMed)
Patient: ${info.patientName} (DOB: ${info.dob})
Blood Type: ${info.bloodType}
Organ Donor: ${info.organDonor ? 'Yes' : 'No'}

ALLERGIES:
${info.allergies.map((a) => `• ${a}`).join('\n')}

EMERGENCY CONTACT:
${info.emergencyContactName} (${info.emergencyContactRelation}): ${info.emergencyContactPhone}

PRIMARY PHYSICIAN:
${info.primaryDoctor} | Clinic: ${info.clinicPhone}

INSURANCE:
${info.insuranceProvider} | Policy #${info.policyNumber}

ACTIVE MEDICATIONS:
${activeMedications.map((m) => `• ${m.name} ${m.dosage} (${m.frequency})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveInfo(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-100">
                In Case of Emergency (I.C.E.)
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                Digital Patient Medical ID Card
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Info'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Type</label>
                  <input
                    type="text"
                    value={formData.bloodType}
                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Emergency Contact Name & Relation</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    placeholder="Contact name"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                    placeholder="Relation (e.g. Spouse)"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Primary Physician</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.primaryDoctor}
                    onChange={(e) => setFormData({ ...formData, primaryDoctor: e.target.value })}
                    placeholder="Doctor name"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={formData.clinicPhone}
                    onChange={(e) => setFormData({ ...formData, clinicPhone: e.target.value })}
                    placeholder="Clinic phone"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Known Allergies (Comma separated)</label>
                <input
                  type="text"
                  value={formData.allergies.join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Patient Core Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Patient Name</span>
                  <span className="text-sm font-bold text-slate-900">{info.patientName}</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Date of Birth</span>
                  <span className="text-sm font-semibold text-slate-800">{info.dob}</span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block">Blood Group</span>
                  <span className="text-sm font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full inline-block">
                    {info.bloodType}
                  </span>
                </div>
              </div>

              {/* Critical Allergies */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>Documented Allergies & Contraindications</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {info.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts & Physician */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Primary Emergency Contact
                  </span>
                  <p className="text-sm font-bold text-slate-900">{info.emergencyContactName}</p>
                  <p className="text-xs text-slate-600">{info.emergencyContactRelation}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-rose-700">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{info.emergencyContactPhone}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Attending Physician & Clinic
                  </span>
                  <p className="text-sm font-bold text-slate-900">{info.primaryDoctor}</p>
                  <p className="text-xs text-slate-600">Clinic Contact</p>
                  <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-teal-700">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{info.clinicPhone}</span>
                  </div>
                </div>
              </div>

              {/* Active Prescriptions on Record */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Prescriptions on File ({activeMedications.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {activeMedications.map((m) => (
                    <div key={m.id} className="p-2.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{m.name}</span>
                        <span className="font-semibold text-teal-700">{m.dosage}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {m.frequency} • {m.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy ICE Record'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Card</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
