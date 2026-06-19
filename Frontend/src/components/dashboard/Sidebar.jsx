// components/Sidebar.jsx
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"; 
import { NAV_ITEMS } from "../Constant";
import bergerLogo from "../../assets/imag.png"; 
import bergerLogo2 from "../../assets/image.png"; 
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

export default function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(role)); 

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full z-40 flex flex-col
        bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl
        border-r border-slate-100 dark:border-slate-800
        shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-60"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-800">
          <img
            src={collapsed ? bergerLogo : bergerLogo2 }
            alt="Berger Paints"
            style={{
              height: collapsed ? "46px" : "155px",
              objectFit: "contain",
              transition: "height 0.3s ease"
            }}
          />
        </div>
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 scrollbar-none">
          {filteredNav.map(item => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setMobileOpen(false); }}
                title={collapsed ? item.label : ""}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group relative
                  ${isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-500 rounded-r-full" />
                )}
                <item.icon size={17} className={`flex-shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`} />
                {!collapsed && <span className="text-sm truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}>
            <LogOut size={17} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md items-center justify-center hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors z-50"
        >
          {collapsed
            ? <ChevronRight size={12} className="text-slate-600 dark:text-slate-300" />
            : <ChevronLeft size={12} className="text-slate-600 dark:text-slate-300" />
          }
        </button>
      </aside>
    </>
  );
}