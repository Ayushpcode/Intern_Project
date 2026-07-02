// components/EmployeesTable.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import { STATUS_BADGE } from "../Colors";
import { getEmployees } from "../../redux/slices/dataAction"; // apna path check karo

export default function EmployeesTable({ onViewAll }) {
  const dispatch = useDispatch();
  const { allEmployees, allEmployeesLoading, allEmployeesError } = useSelector(
    (state) => state.transaction
  );

  const recentEmployees = [...(allEmployees ?? [])]
  .sort((b, a) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 5);

  useEffect(() => {
    dispatch(getEmployees());
  }, [dispatch]);

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
        {/* Loading state */}
        {allEmployeesLoading && (
          <div className="flex items-center justify-center py-10 text-xs text-slate-400">
            Loading employees...
          </div>
        )}

        {/* Error state */}
        {allEmployeesError && (
          <div className="flex items-center justify-center py-10 text-xs text-red-400">
            Error: {allEmployeesError?.message ?? "Kuch galat ho gaya"}
          </div>
        )}

        {/* Table */}
        {!allEmployeesLoading && !allEmployeesError && (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {["Employee", "Email", "Role", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {recentEmployees?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-xs text-slate-400">
                    Koi employee nahi mila
                  </td>
                </tr>
              ) : (
                recentEmployees?.map((emp, index) => (
                  <tr
                    key={emp.emp_id ?? `recent-row-${index}`}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {emp.emp_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                            {emp.emp_name}
                          </p>
                          <p className="text-[10px] text-slate-400">{emp.emp_id ?? "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                      {emp.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {emp.role ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-[10px] font-semibold px-2 py-1 rounded-full ${STATUS_BADGE[emp.status] ?? ""
                          }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400">
                        <MoreHorizontal size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}