import { useState, useEffect } from "react";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../redux/slices/dataAction";

const PER_PAGE = 10;
const ALL = "All";

export default function RecordsPage() {
    const dispatch = useDispatch();
    const { transactions: records, listLoading: loading, listError: error } = useSelector(s => s.transaction);

    const [regionFilter, setRegionFilter] = useState(ALL);
    const [page, setPage] = useState(1);

    const fetchRecords = () => dispatch(getTransactions());

    useEffect(() => { fetchRecords(); }, []);

    const regions = [ALL, ...new Set(records.map(r => r.region).filter(Boolean))];

    const filtered = records.filter(r =>
        regionFilter === ALL || r.region === regionFilter
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const downloadRecord = (record) => {
        const content = [
            `Transaction Record`,
            `==================`,
            `Region         : ${record.region}`,
            `Deport         : ${record.deport}`,
            `Account Number : ${record.acc_number}`,
            `Account Name   : ${record.acc_name}`,
            `Trx Date       : ${record.trx_date}`,
            `Invoice Number : ${record.invoice_number}`,
            `Volume         : ${record.volume}`,
            `Value          : ${record.value}`,
            `Employee       : ${record.emp_name}`,
        ].join("\n");

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `record_${record.invoice_number}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const COLUMNS = [
        { key: "region", label: "Region" },
        { key: "deport", label: "Deport" },
        { key: "acc_number", label: "Acc Number" },
        { key: "acc_name", label: "Acc Name" },
        { key: "trx_date", label: "Trx Date" },
        { key: "invoice_number", label: "Invoice No." },
        { key: "volume", label: "Volume" },
        { key: "value", label: "Value" },
        { key: "emp_name", label: "Employee" },
    ];

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Records</h2>
                    <p className="text-xs text-slate-400 mt-0.5">View and download all transaction records</p>
                </div>
                <button
                    onClick={fetchRecords}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <RefreshCw size={12} />
                    Refresh
                </button>
            </div>

            {/* Region Filter */}
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

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50">
                                {[...COLUMNS.map(c => c.label), "Download"].map(h => (
                                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={COLUMNS.length + 1} className="px-5 py-10 text-center">
                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                                            <Loader2 size={16} className="animate-spin" /> Loading records...
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={COLUMNS.length + 1} className="px-5 py-10 text-center text-sm text-red-400">{error}</td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={COLUMNS.length + 1} className="px-5 py-10 text-center text-sm text-slate-400">No records found.</td>
                                </tr>
                            ) : paginated.map((record, idx) => (
                                <tr key={record.invoice_number ?? idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    {COLUMNS.map(col => (
                                        <td key={col.key} className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {record[col.key] ?? "—"}
                                        </td>
                                    ))}
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => downloadRecord(record)}
                                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                            <Download size={11} />
                                            Download
                                        </button>
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
                        {regionFilter !== ALL && ` (filtered from ${records.length})`}
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