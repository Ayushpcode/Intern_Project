// components/QuickActions.jsx
import { DollarSign } from "lucide-react";
import { QUICK_ACTIONS } from "../Constant";
import { COLOR } from "../Colors";

export default function QuickActions() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Quick Actions</h3>
        <p className="text-xs text-slate-400 mt-0.5">Shortcuts & tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ label, icon: Icon, color }) => {
          const c = COLOR[color];
          return (
            <button
              key={label}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl ${c.bg} ring-1 ${c.ring} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div className={`p-2 rounded-lg ${c.icon} shadow-sm`}>
                <Icon size={15} className="text-white" />
              </div>
              <span className={`text-xs font-semibold ${c.text} text-center leading-tight`}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Payroll strip */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-blue-100">Next Payroll Run</p>
            <p className="text-sm font-bold mt-0.5">June 28, 2026</p>
          </div>
          <div className="bg-white/20 p-2 rounded-lg">
            <DollarSign size={16} />
          </div>
        </div>
        <div className="mt-2 bg-white/20 rounded-full h-1.5">
          <div className="bg-white rounded-full h-1.5 w-[72%]" />
        </div>
        <p className="text-[10px] text-blue-100 mt-1">72% processing complete</p>
      </div>
    </div>
  );
}