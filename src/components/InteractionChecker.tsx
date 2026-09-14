import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Info,
  Apple,
  Pill,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Medication, DrugInteraction } from '../types';
import { KNOWN_INTERACTIONS } from '../utils/chronobiology';

interface InteractionCheckerProps {
  medications: Medication[];
}

export const InteractionChecker: React.FC<InteractionCheckerProps> = ({
  medications
}) => {
  // Find which interactions apply to the user's active prescriptions
  const activeMedNames = medications.map((m) => m.name.toLowerCase());

  const matchedInteractions: DrugInteraction[] = KNOWN_INTERACTIONS.filter((interaction) => {
    return interaction.involvedItems.some((item) =>
      activeMedNames.some((medName) => medName.includes(item.toLowerCase()) || item.toLowerCase().includes(medName))
    );
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Drug & Food Interaction Monitor
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                Patient Safety Scanner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated surveillance of food, beverage, and drug-drug metabolic interferences
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Active Scanner Running</span>
        </div>
      </div>

      {/* Interactions list */}
      {matchedInteractions.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No Severe Conflicts Detected</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Your active medications do not have known adverse cross-reactions with each other. Continue taking doses as prescribed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {matchedInteractions.map((item) => {
            const isFood = item.severity === 'food';
            const isModerate = item.severity === 'moderate';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isFood
                    ? 'bg-amber-50/40 border-amber-200'
                    : isModerate
                    ? 'bg-orange-50/40 border-orange-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isFood
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-orange-100 text-orange-900 border border-orange-300'
                      }`}
                    >
                      {isFood ? 'Dietary / Food Warning' : 'Moderate Interaction'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <Pill className="h-3 w-3 text-slate-400" />
                    <span>Involves: {item.involvedItems.join(' + ')}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 space-y-2 mt-3 bg-white/80 p-3.5 rounded-xl border border-slate-200/80">
                  <p>
                    <strong className="text-slate-900">Biological Impact: </strong>
                    {item.description}
                  </p>
                  <p className="text-teal-900 bg-teal-50/80 p-2.5 rounded-lg border border-teal-200/60">
                    <strong className="text-teal-950">Clinical Recommendation: </strong>
                    {item.recommendation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Advice Note */}
      <div className="flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Always inform your prescribing physician and pharmacist about all over-the-counter supplements, herbals, and dietary habits.
        </p>
      </div>
    </div>
  );
};
