import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter, Users, UserCheck, TrendingUp, BarChart2, DollarSign, Clock } from "lucide-react";
import { getDashboardStats } from "../redux/slices/dataAction";
import EmployeesTable from "../components/dashboard/EmployeesTable";

export default function Dashboard({ loading, onViewAllEmployees }) {
  const dispatch = useDispatch();
  const { dashboardStats: stats, dashboardLoading } = useSelector((state) => state.transaction);
  const { user } = useSelector((state) => state.auth);
  console.log("AUTH STATE:", user);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "ceo";

  const calcChange = (val) => {
    if (val === null || val === undefined) return null;
    return val;
  };

  const statCards = [
    {
      label: "Total Employees",
      value: stats?.totalEmployees ?? 0,
      sub: stats?.employeeChange !== null ? `${stats?.employeeChange > 0 ? "+" : ""}${stats?.employeeChange}% last month` : "No change data",
      change: stats?.employeeChange,
      icon: <Users size={14} />,
      color: "text-blue-600",
      border: "border-l-blue-400",
    },
    {
      label: "Active Employees",
      value: stats?.totalActive ?? 0,
      sub: `${stats?.totalEmployees ? Math.round((stats?.totalActive / stats?.totalEmployees) * 100) : 0}% of total`,
      change: null,
      icon: <UserCheck size={14} />,
      color: "text-emerald-600",
      border: "border-l-emerald-500",
    },
    {
      label: "Total Transactions",
      value: stats?.totalTransactions ?? 0,
      sub: stats?.transactionChange !== null ? `${stats?.transactionChange > 0 ? "+" : ""}${stats?.transactionChange}% last month` : "No change data",
      change: stats?.transactionChange,
      icon: <TrendingUp size={14} />,
      color: "text-violet-600",
      border: "border-l-violet-400",
    },
    {
      label: "Total Volume",
      value: stats?.totalVolume ?? 0,
      sub: stats?.volumeChange !== null ? `${stats?.volumeChange > 0 ? "+" : ""}${stats?.volumeChange}% last month` : "No change data",
      change: stats?.volumeChange,
      icon: <BarChart2 size={14} />,
      color: "text-orange-500",
      border: "border-l-orange-400",
    },
    {
      label: "Total Value",
      value: stats?.totalValue ? `₹${stats.totalValue.toLocaleString("en-IN")}` : "₹0",
      sub: stats?.valueChange !== null ? `${stats?.valueChange > 0 ? "+" : ""}${stats?.valueChange}% last month` : "No change data",
      change: stats?.valueChange,
      icon: <DollarSign size={14} />,
      color: "text-green-600",
      border: "border-l-green-400",
    },
    {
      label: "Pending",
      value: stats?.totalPending ?? 0,
      sub: stats?.totalPending === 0 ? "No pending" : "Needs attention",
      change: null,
      icon: <Clock size={14} />,
      color: "text-red-500",
      border: "border-l-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Overview</h2>
            <p className="text-xs text-slate-400 mt-0.5">June 2026 · Updated just now</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors font-medium">
            <Filter size={12} /> Filter
          </button>
        </div>

        {/* ✅ Sirf Admin/CEO ko dikhega */}
        {isAdmin && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
            {dashboardLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-4 h-24 animate-pulse" />
              ))
            ) : (
              statCards.map((s) => (
                <div
                  key={s.label}
                  className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 border-l-4 ${s.border} rounded-lg p-4 flex flex-col gap-2`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}>
                    {s.icon}
                    {s.label}
                  </div>
                  <p className="text-2xl font-medium text-slate-800 dark:text-white leading-none">
                    {s.value}
                  </p>
                  <p className={`text-[11px] ${s.change > 0 ? "text-emerald-500" : s.change < 0 ? "text-red-400" : "text-slate-400"}`}>
                    {s.sub}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4">
        <EmployeesTable onViewAll={onViewAllEmployees} />
      </section>
    </div>
  );
}