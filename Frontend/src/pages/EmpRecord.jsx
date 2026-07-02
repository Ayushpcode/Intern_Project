import { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeStats } from "../redux/slices/dataAction";

const PER_PAGE = 10;
const ALL = "All";

export default function EmployeeRecordsPage() {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const { employeeStats: data, employeeStatsLoading: loading } = useSelector(
        (s) => s.transaction
    );

    const [regionFilter, setRegionFilter] = useState(ALL);
    const [page, setPage] = useState(1);

    const fetchRecords = () => {
        if (user?.emp_id) dispatch(getEmployeeStats(user.emp_id));
    };

    useEffect(() => {
        fetchRecords();
    }, [user?.emp_id]);

    const allTransactions = data?.recentTransactions ?? [];

    const regions = [ALL, ...new Set(allTransactions.map(r => r.region).filter(Boolean))];
    const filtered = allTransactions.filter(
        r => regionFilter === ALL || r.region === regionFilter
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">My Records</h2>
                    <p className="text-xs text-slate-400 mt-0.5">View your transaction records</p>
                </div>
                <button
                    onClick={fetchRecords}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <RefreshCw size={12} />
                    Refresh
                </button>
            </div>

            {/* Region Filter */}
            {regions.length > 1 && (
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">Region</label>
                    <div className="flex flex-wrap gap-1.5">
                        {regions.map(r => (
                            <button key={r} onClick={() => { setRegionFilter(r); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${regionFilter === r
                                    ? "bg-blue-500 text-white"
                                    : "bg-white dark:bg-slate-800 text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50"}`}>
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700">
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Invoice</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Account</th>
                                <th className="text-left px-4 py-3 text-slate-400 font-medium">Region</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Volume</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Value</th>
                                <th className="text-right px-4 py-3 text-slate-400 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                            <Loader2 size={16} className="animate-spin" /> Loading records...
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No records found.</td>
                                </tr>
                            ) : paginated.map((trx, i) => (
                                <tr
                                    key={trx.trx_id ?? i}
                                    className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors last:border-b-0"
                                >
                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                        #{trx.invoice_number}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-30 truncate">
                                        {trx.acc_name ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                        {trx.region ?? "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">
                                        {trx.volume != null ? Number(trx.volume).toLocaleString("en-IN") : "—"}
                                    </td>
                                    <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                        {trx.value != null ? `₹${Number(trx.value).toLocaleString("en-IN")}` : "—"}
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

                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-400">
                        Showing {paginated.length} of {filtered.length}
                        {regionFilter !== ALL && ` (filtered from ${allTransactions.length})`}
                    </p>
                    <div className="flex gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}>
                                {p}
                            </button>
                        ))}
                        {totalPages > 5 && (
                            <>
                                <span className="w-7 h-7 flex items-center justify-center text-xs text-slate-400">…</span>
                                <button onClick={() => setPage(totalPages)}
                                    className="w-7 h-7 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    {totalPages}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}