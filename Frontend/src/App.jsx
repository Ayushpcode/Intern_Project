import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import { NOTIFICATIONS_DATA } from "./components/Constant";
import Sidebar from "./components/dashboard/Sidebar";
import Navbar from "./components/dashboard/Navbar";
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/EmployeesPage";
import PlaceholderPage from "./components/dashboard/PlaceHolderPages";
import PaintLoginPage from "./pages/LoginPage";
import { WaitingPage } from "./pages/WaitingPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import DataEntryPage from "./pages/DataEntry";
import RecordsPage from "./pages/Records";

function AppLayout() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifs, setNotifs] = useState();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const renderPage = () => {
    if (active === "dashboard")
     return <Dashboard onViewAllEmployees={() => setActive("employees")} />;
    if (active === "employees")
      return <EmployeesPage />;
    if (active === "data-entry")

      return <DataEntryPage />;
    if (active === "reports")
      return <RecordsPage />;
    return <PlaceholderPage id={active} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300">
      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />
      <Navbar
        collapsed={collapsed}
        mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
        active={active}
        notifs={notifs} setNotifs={setNotifs}
      />
      <main className={`pt-16 transition-all duration-300 ${collapsed ? "lg:pl-[68px]" : "lg:pl-60"}`}>
        <div className="p-4 sm:p-6 max-w-[1600px] mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaintLoginPage />} />
      <Route path="/waiting" element={<WaitingPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}