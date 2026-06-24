import {
  LayoutDashboard, Users, UserCheck, Building2, CalendarCheck,
  FileText, DollarSign, FolderKanban, BarChart3, Bell, Settings,
  UserPlus, Briefcase, AlertCircle, Star, CheckCircle, Download,
  ClipboardList
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, roles: ["ADMIN", "CEO", "CIO", "EMPLOYEE"] },
  { id: "data-entry",    label: "Data Entry",    icon: ClipboardList,   roles: ["ADMIN"] },
  { id: "employees",     label: "Employees",     icon: UserCheck,       roles: ["ADMIN", "CEO", "CIO"] },
  { id: "reports",       label: "Reports",       icon: BarChart3,       roles: ["ADMIN", "CEO", "CIO"] },
];
