import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
// import { STATS_CARDS_CONFIG } from "../components/Constant";
import { getDashboardStats } from "../redux/slices/dataAction";
// import StatCard from "../components/dashboard/StatCard";
import EmployeesTable from "../components/dashboard/EmployeesTable";

export default function Dashboard({ loading, onViewAllEmployees }) {
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading } = useSelector((s) => s.transaction);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

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
        {/* <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {STATS_CARDS_CONFIG.map((config) => (
            <StatCard
              key={config.id}
              loading={dashboardLoading}
              card={{
                ...config,
                value:  dashboardStats?.[config.key]    ?? 0,
                change: config.changeKey
                  ? dashboardStats?.[config.changeKey]  ?? null
                  : null,
              }}
            />
          ))}
        </div> */}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <EmployeesTable onViewAll={onViewAllEmployees} />
      </section>
    </div>
  );
}