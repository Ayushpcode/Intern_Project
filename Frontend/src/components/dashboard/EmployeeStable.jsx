// components/EmployeesTable.jsx
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { EMPLOYEES_TABLE } from "../Constant";
import { STATUS_BADGE } from "../Colors";

export default function EmployeesTable({ onViewAll }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Employees</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest additions & updates</p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
        >
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50">
              {["Employee","Email", "Role", "Status", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {EMPLOYEES_TABLE.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {emp.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{emp.name}</p>
                      <p className="text-[10px] text-slate-400">{emp.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{emp.email}</td>
                <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{emp.role}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[emp.status] ?? ""}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                    <MoreHorizontal size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}