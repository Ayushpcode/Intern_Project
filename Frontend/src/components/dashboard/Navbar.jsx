// components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { NAV_ITEMS } from "../Constant";
import NotifDropdown from "./NotificationDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

export default function Navbar({ collapsed, mobileOpen, setMobileOpen, active, dark, setDark, notifs, setNotifs }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { user, role } = useSelector((state) => state.auth);
  const initials = user?.name
    ? user.name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
    
  const title = NAV_ITEMS.find(n => n.id === active)?.label ?? "Dashboard";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fn = e => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <header className={`
      fixed top-0 right-0 z-20 h-16
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
      border-b border-slate-100 dark:border-slate-800
      flex items-center px-4 gap-4
      transition-all duration-300
      ${collapsed ? "left-[68px]" : "left-0 lg:left-60"}
    `}>
      <button
        onClick={() => setMobileOpen(v => !v)}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div className="hidden sm:block">
        <p className="text-sm font-bold text-slate-800 dark:text-white">{title}</p>
        <p className="text-[10px] text-slate-400">Berger Paints</p>
      </div>

      <div className="flex-1 max-w-sm mx-4 hidden md:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees, reports..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        {role?.toLowerCase() === "admin" && (
          <NotifDropdown notifs={notifs} setNotifs={setNotifs} open={notifOpen} setOpen={setNotifOpen} />
        )}

        <div ref={profileRef} className="relative ml-1">
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500 to-red-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-none">{user?.name || "User"}</p>
              <p className="text-[10px] text-slate-400">{role || "—"}</p>
            </div>
            <ChevronDown size={12} className="text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800 z-50 overflow-hidden py-1">
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}