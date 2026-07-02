// components/NotificationDropdown.jsx
import { useRef, useEffect, useState } from "react";
import { Bell, X, UserCheck, UserX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingEmployees,
  approveEmployee,
  rejectEmployee,
} from "../../redux/slices/adminAction";

const ROLES = ["ADMIN", "CEO", "CIO", "EMPLOYEE"];
const POLL_INTERVAL = 30000; // 30 seconds — apni marzi se adjust kar lo

// ── Approval Popup ────────────────────────────────────────────────────────────
function ApprovalPopup({ user, onClose, onApprove, onReject }) {
  const [role, setRole] = useState("");
  const [region, setRegion] = useState("");
  const [step, setStep] = useState("confirm");
  const ref = useRef();

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [onClose]);

  const handleApprove = () => {
    if (!role || !region) return;
    onApprove(user.id, { role, region });
    setStep("done");
    setTimeout(onClose, 1400);
  };

  const selectStyle = {
    width: "100%", height: "42px", padding: "0 12px",
    border: "1.5px solid #e5e7eb", borderRadius: "10px",
    fontSize: "13px", fontFamily: "inherit", outline: "none",
    background: "#f9fafb", color: "#111", cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
    }}>
      <div ref={ref} style={{
        background: "#fff", borderRadius: "20px",
        width: "100%", maxWidth: "400px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        overflow: "hidden",
        animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        fontFamily: "inherit",
      }}>
        <style>{`
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.88) translateY(16px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes checkPop {
            0%   { transform: scale(0); opacity: 0; }
            70%  { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .sel-focus:focus { border-color: #4f6ef7 !important; box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
        `}</style>

        {/* Header */}
        <div style={{
          padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "12px",
              background: "linear-gradient(135deg,#4f6ef7,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: "700", fontSize: "14px",
            }}>
              {user.avatar}
            </div>
            <div>
              <p style={{ fontWeight: "700", fontSize: "14px", color: "#111" }}>{user.name}</p>
              <p style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#f1f5f9", border: "none", borderRadius: "8px",
            width: "30px", height: "30px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          {step === "confirm" && (
            <>
              <div style={{
                background: "#fef3c7", borderRadius: "12px",
                padding: "12px 14px", marginBottom: "20px",
                display: "flex", gap: "10px", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "18px" }}>⏳</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: "#92400e" }}>Awaiting Approval</p>
                  <p style={{ fontSize: "11px", color: "#a16207", marginTop: "2px" }}>
                    This user registered {user.time} and is waiting for admin approval.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => { onReject(user.id); onClose(); }}
                  style={{
                    flex: 1, height: "44px", border: "1.5px solid #fecaca",
                    borderRadius: "11px", background: "#fff5f5",
                    color: "#ef4444", fontWeight: "600", fontSize: "13px",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "6px", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#f87171"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.borderColor = "#fecaca"; }}
                >
                  <UserX size={14} /> Reject
                </button>
                <button
                  onClick={() => setStep("assign")}
                  style={{
                    flex: 1, height: "44px", border: "none",
                    borderRadius: "11px",
                    background: "linear-gradient(135deg,#4f6ef7,#7c3aed)",
                    color: "#fff", fontWeight: "600", fontSize: "13px",
                    cursor: "pointer", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: "6px", fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(79,110,247,0.35)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <UserCheck size={14} /> Approve
                </button>
              </div>
            </>
          )}

          {step === "assign" && (
            <>
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "16px", fontWeight: "500" }}>
                Assign role and region to <strong style={{ color: "#111" }}>{user.name}</strong>
              </p>

              {/* ✅ Role Dropdown */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="sel-focus"
                  style={selectStyle}
                >
                  <option value="">Select a role...</option>
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Region — free text input */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Region
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  placeholder="e.g. N1, SOUTH, E2..."
                  className="sel-focus"
                  style={{
                    width: "100%", height: "42px", padding: "0 12px",
                    border: "1.5px solid #e5e7eb", borderRadius: "10px",
                    fontSize: "13px", fontFamily: "inherit", outline: "none",
                    background: "#f9fafb", color: "#111",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Live preview badges */}
              {(role || region) && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                  {role && (
                    <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#ede9fe", color: "#7c3aed", fontSize: "11px", fontWeight: "600" }}>
                      {role}
                    </span>
                  )}
                  {region && (
                    <span style={{ padding: "4px 10px", borderRadius: "20px", background: "#dbeafe", color: "#2563eb", fontSize: "11px", fontWeight: "600" }}>
                      {region}
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setStep("confirm")}
                  style={{
                    height: "44px", padding: "0 18px",
                    border: "1.5px solid #e5e7eb", borderRadius: "11px",
                    background: "#fff", color: "#555", fontSize: "13px",
                    fontWeight: "500", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleApprove}
                  disabled={!role || !region}
                  style={{
                    flex: 1, height: "44px", border: "none", borderRadius: "11px",
                    background: (!role || !region) ? "#e5e7eb" : "linear-gradient(135deg,#10b981,#059669)",
                    color: (!role || !region) ? "#9ca3af" : "#fff",
                    fontWeight: "600", fontSize: "13px",
                    cursor: (!role || !region) ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    boxShadow: (!role || !region) ? "none" : "0 4px 14px rgba(16,185,129,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  ✓ Confirm Approval
                </button>
              </div>
            </>
          )}

          {step === "done" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: "linear-gradient(135deg,#10b981,#059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
                animation: "checkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                <span style={{ fontSize: "24px" }}>✓</span>
              </div>
              <p style={{ fontWeight: "700", fontSize: "15px", color: "#111" }}>Approved!</p>
              <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
                {user.name} assigned as <strong>{role}</strong> · <strong>{region}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotifDropdown({ notifs, setNotifs, open, setOpen }) {
  const ref = useRef();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // ── Fetch pending users on mount + poll every 30s (real-time badge) ────────
  useEffect(() => {
    if (role !== "ADMIN") return;

    let cancelled = false;

    const fetchPending = () => {
      setFetchError(null);
      dispatch(getPendingEmployees()).then((result) => {
        if (cancelled) return;
        if (getPendingEmployees.fulfilled.match(result)) {
          const mapped = result.payload.data.map((emp) => ({
            id: emp.ID,
            name: emp.EMP_NAME,
            email: emp.EMAIL,
            avatar: emp.EMP_NAME.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
            time: new Date(emp.CREATED_AT).toLocaleString(),
          }));
          setPendingUsers(mapped);
        } else {
          setFetchError("Failed to load pending users.");
        }
      });
    };

    // Turant ek baar fetch karo (mount pe / page load pe)
    fetchPending();

    // Har POLL_INTERVAL ms mein dubara check karo (real-time jaisa feel)
    const interval = setInterval(fetchPending, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [dispatch, role]); // ⚠️ `open` dependency hata di gayi hai

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [setOpen]);

  const totalBadge = pendingUsers.length;

  const handleApprove = async (userId, { role, region }) => {
    const result = await dispatch(approveEmployee({ id: userId, role, region }));
    if (approveEmployee.fulfilled.match(result)) {
      setPendingUsers(us => us.filter(u => u.id !== userId));
    }
  };

  const handleReject = async (userId) => {
    const result = await dispatch(rejectEmployee(userId));
    if (rejectEmployee.fulfilled.match(result)) {
      setPendingUsers(us => us.filter(u => u.id !== userId));
    }
  };

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(v => !v)}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={18} />
          {totalBadge > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {totalBadge}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-300/50 ring-1 ring-slate-100 z-50 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">Notifications</p>
            </div>

            <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">

              {/* Fetch error */}
              {role === "ADMIN" && fetchError && (
                <div className="px-4 py-3 text-xs text-red-500 text-center">{fetchError}</div>
              )}

              {role === "ADMIN" && pendingUsers.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-amber-50">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      ⏳ Awaiting Approval ({pendingUsers.length})
                    </p>
                  </div>
                  {pendingUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => { setSelectedUser(user); setOpen(false); }}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-amber-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        <p className="text-[10px] text-amber-500 mt-0.5">Registered {user.time}</p>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 mt-1">
                        Pending
                      </span>
                    </button>
                  ))}
                </>
              )}

              {/* Empty state */}
              {role === "ADMIN" && !fetchError && pendingUsers.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-400">
                  No pending approvals
                </div>
              )}

            </div>

            <div className="px-4 py-3 border-t border-slate-100">
              <button className="text-xs text-blue-500 hover:text-blue-600 font-medium w-full text-center">
                View all notifications →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approval popup */}
      {selectedUser && (
        <ApprovalPopup
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
}