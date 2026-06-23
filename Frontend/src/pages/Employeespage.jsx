import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, X, Check, Search, Users } from "lucide-react";
import { getEmployees, updateEmployee } from "../redux/slices/dataAction";

const ALL = "All";
const PER_PAGE = 8;

const STATUS_BADGE = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
  PENDING: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
};

const STATUS_DOT = {
  ACTIVE: "bg-emerald-500",
  REJECTED: "bg-red-500",
  PENDING: "bg-orange-400",
};

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const {
    allEmployees: data,
    allEmployeesLoading: loading,
    allEmployeesError: error,
  } = useSelector((state) => state.transaction);

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [regionFilter, setRegionFilter] = useState(ALL);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getEmployees());
  }, []);

  // ✅ Sab DB se dynamic
  const uniqueRegions = [...new Set(data.map(e => e.region).filter(Boolean))].sort();
  const uniqueStatuses = [...new Set(data.map(e => e.status).filter(Boolean))].sort();
  const uniqueRoles = [...new Set(data.map(e => e.role).filter(Boolean))].sort();

  const filterStatuses = [ALL, ...uniqueStatuses];
  const filterRegions = [ALL, ...uniqueRegions];

  const filtered = data.filter((e) => {
    const matchesSearch =
      search.trim() === "" ||
      e.emp_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.emp_id?.toLowerCase().includes(search.toLowerCase());
    return (
      matchesSearch &&
      (statusFilter === ALL || e.status === statusFilter) &&
      (regionFilter === ALL || e.region === regionFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const startEdit = (emp) => {
    setEditId(emp.emp_id);
    setEditForm({ role: emp.role ?? null, status: emp.status });
  };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };
  const saveEdit = (emp_id) => {
    dispatch(updateEmployee({ emp_id, changes: editForm }));
    setEditId(null);
    setEditForm({});
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-sm text-slate-400">Loading employees…</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-20">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Employees</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage and view all employees</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 rounded-lg px-3 py-1.5">
          <Users size={13} />
          {filtered.length} total
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or ID…"
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-slate-600 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Status — DB se dynamic */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">Status</label>
          <div className="flex flex-wrap gap-1.5">
            {filterStatuses.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50"
                  }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="w-px bg-slate-200 dark:bg-slate-700 self-stretch hidden sm:block" />

        {/* Region — DB se dynamic */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-1">Region</label>
          <div className="flex flex-wrap gap-1.5">
            {filterRegions.map((r) => (
              <button key={r} onClick={() => { setRegionFilter(r); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${regionFilter === r ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-slate-500 ring-1 ring-slate-200 dark:ring-slate-700 hover:bg-slate-50"
                  }`}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50">
                {["Employee", "Role", "DOB", "Email", "Region", "Status", "Action"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-slate-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                paginated.map((emp) => {
                  // ✅ Reject walo ka edit band
                  const isRejected = emp.status?.toLowerCase() === "REJECTED";

                  return (
                    <tr key={emp.emp_id} className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${isRejected ? "opacity-60" : ""}`}>

                      {/* Employee */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {emp.emp_name?.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{emp.emp_name}</p>
                            <p className="text-[10px] text-slate-400">{emp.emp_id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5">
                        {editId === emp.emp_id ? (
                          <select value={editForm.role ?? ""}
                            onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value || null }))}
                            className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-400"
                          >
                            <option value="">— None —</option>
                            {uniqueRoles.map(r => <option key={r}>{r}</option>)}
                          </select>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {emp.role ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                          </span>
                        )}
                      </td>

                      {/* DOB */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {emp.dob ? new Date(emp.dob).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        }) : "—"}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{emp.email}</td>

                      {/* Region */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {emp.region ?? <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {editId === emp.emp_id ? (
                          <select value={editForm.status}
                            onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                            className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 outline-none focus:ring-1 focus:ring-blue-400"
                          >
                            {uniqueStatuses.map(s => <option key={s}>{s}</option>)}
                          </select>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[emp.status] ?? "bg-slate-100 text-slate-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[emp.status] ?? "bg-slate-400"}`} />
                            {emp.status ?? "—"}
                          </span>
                        )}
                      </td>

                      {/* ✅ Action — Reject pe edit band */}
                      <td className="px-5 py-3.5">
                        {isRejected ? (
                          <span className="text-[10px] text-slate-300 dark:text-slate-600 px-2">—</span>
                        ) : editId === emp.emp_id ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => saveEdit(emp.emp_id)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                              <Check size={11} /> Save
                            </button>
                            <button onClick={cancelEdit}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                              <X size={11} /> Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => startEdit(emp)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-slate-200 dark:ring-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <Pencil size={11} /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400">
            Showing {paginated.length} of {filtered.length}
            {(statusFilter !== ALL || regionFilter !== ALL || search) && ` (filtered from ${data.length})`}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? "bg-blue-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}>{p}</button>
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