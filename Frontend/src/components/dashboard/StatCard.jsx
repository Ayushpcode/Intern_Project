import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../redux/slices/dataAction";
import { STATS_CARDS_CONFIG } from "../Constant";
import StatCard from "../dashboard/StatCard";

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { dashboardStats, dashboardLoading } = useSelector((s) => s.transaction);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {(STATS_CARDS_CONFIG ?? []).map((config) => (
        <StatCard
          key={config.id}
          loading={dashboardLoading}
          card={{
            ...config,
            value:  dashboardStats?.[config.key]       ?? 0,
            change: config.changeKey
              ? dashboardStats?.[config.changeKey] ?? null
              : null,
          }}
        />
      ))}
    </div>
  );
}