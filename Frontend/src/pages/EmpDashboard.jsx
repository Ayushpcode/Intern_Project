import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TrendingUp,
  BarChart2,
  DollarSign,
  User,
  MapPin,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { getEmployeeStats } from "../redux/slices/dataAction";

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { employeeStats: data, employeeStatsLoading } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    if (user?.emp_id) {
      dispatch(getEmployeeStats(user.emp_id));
    }
  }, [user?.emp_id, dispatch]);

  const stats = data?.stats;
  const employee = data?.employee;
  const recentTransactions = data?.recentTransactions ?? [];

  const calcChange = (val) => {
    if (val === null || val === undefined) return null;
    return val;
  };

  const statCards = [
    {
      label: "My Transactions",
      value: stats?.totalTransactions ?? 0,
      sub:
        calcChange(stats?.transactionChange) !== null
          ? `${stats.transactionChange > 0 ? "+" : ""}${stats.transactionChange}% last month`
          : "No change data",
      change: stats?.transactionChange,
      icon: <TrendingUp size={14} />,
      color: "text-violet-600",
      border: "border-l-violet-400",
    },
    {
      label: "Total Volume",
      value: stats?.totalVolume ?? 0,
      sub:
        calcChange(stats?.volumeChange) !== null
          ? `${stats.volumeChange > 0 ? "+" : ""}${stats.volumeChange}% last month`
          : "No change data",
      change: stats?.volumeChange,
      icon: <BarChart2 size={14} />,
      color: "text-orange-500",
      border: "border-l-orange-400",
    },
    {
      label: "Total Value",
      value: stats?.totalValue
        ? `₹${Number(stats.totalValue).toLocaleString("en-IN")}`
        : "₹0",
      sub:
        calcChange(stats?.valueChange) !== null
          ? `${stats.valueChange > 0 ? "+" : ""}${stats.valueChange}% last month`
          : "No change data",
      change: stats?.valueChange,
      icon: <DollarSign size={14} />,
      color: "text-green-600",
      border: "border-l-green-400",
    },
    {
      label: "This Month",
      value: stats?.thisMonth?.transactions ?? 0,
      sub: `₹${Number(stats?.thisMonth?.value ?? 0).toLocaleString("en-IN")} value`,
      change: null,
      icon: <Clock size={14} />,
      color: "text-blue-500",
      border: "border-l-blue-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              My Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              June 2026 · Personal overview
            </p>
          </div>
        </div>

        {/* Profile Card */}
        {employeeStatsLoading ? (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4 h-24 animate-pulse mb-4" />
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4 mb-4 flex items-center gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
              <User size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                {employee?.emp_name ?? user?.name ?? "—"}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {employee?.email ?? "—"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <MapPin size={11} />
                {employee?.region ?? user?.region ?? "—"}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  employee?.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                <CheckCircle size={10} />
                {employee?.status ?? "—"}
              </span>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {employeeStatsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4 h-24 animate-pulse"
                />
              ))
            : statCards.map((s) => (
                <div
                  key={s.label}
                  className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 border-l-4 ${s.border} rounded-lg p-4 flex flex-col gap-2`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}
                  >
                    {s.icon}
                    {s.label}
                  </div>
                  <p className="text-2xl font-medium text-slate-800 dark:text-white leading-none">
                    {s.value}
                  </p>
                  <p
                    className={`text-[11px] ${
                      s.change > 0
                        ? "text-emerald-500"
                        : s.change < 0
                        ? "text-red-400"
                        : "text-slate-400"
                    }`}
                  >
                    {s.change > 0 ? (
                      <ArrowUpRight size={10} className="inline mr-0.5" />
                    ) : s.change < 0 ? (
                      <ArrowDownRight size={10} className="inline mr-0.5" />
                    ) : null}
                    {s.sub}
                  </p>
                </div>
              ))}
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Recent Transactions
        </h3>
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg overflow-hidden">
          {employeeStatsLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"
                />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No transactions yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">
                      Invoice
                    </th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">
                      Account
                    </th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">
                      Region
                    </th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">
                      Volume
                    </th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">
                      Value
                    </th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((trx, i) => (
                    <tr
                      key={trx.trx_id}
                      className={`border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                        i === recentTransactions.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                        #{trx.invoice_number}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-30 truncate">
                        {trx.acc_name}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                        {trx.region}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                        {Number(trx.volume).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                        ₹{Number(trx.value).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">
                        {trx.trx_date
                          ? new Date(trx.trx_date).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}