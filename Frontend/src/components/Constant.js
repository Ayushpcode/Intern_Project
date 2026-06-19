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


export const STATS_CARDS_CONFIG = [
  { id: 1, key: "totalEmployees",    changeKey: "employeeChange",    label: "Total Employees",    icon: Users,       color: "blue",    sub: "Excluding admins"  },
  { id: 2, key: "totalTransactions", changeKey: "transactionChange", label: "Total Transactions", icon: BarChart3,   color: "emerald", sub: "All time entries"  },
  { id: 3, key: "totalVolume",       changeKey: "volumeChange",      label: "Total Volume",       icon: DollarSign,  color: "amber",   sub: "All time volume"   },
  { id: 4, key: "totalValue",        changeKey: "valueChange",       label: "Total Value",        icon: DollarSign,  color: "violet",  sub: "All time value"    },
  { id: 5, key: "totalPending",      changeKey: null,                label: "Pending Requests",   icon: AlertCircle, color: "rose",    sub: "Awaiting approval" },
];

export const ROLES = [
  "Sr. Frontend Dev", "Marketing Lead", "UX Designer",
  "DevOps Engineer", "Finance Analyst", "HR Manager",
  "Backend Dev", "Sales Executive", "Product Manager", "Operations Lead",
];

export const REGIONS = ["North", "South", "East", "West", "Central"];

export const EMPLOYEES_TABLE = [
  { id: "EMP001", name: "Priya Sharma",  email: "test1@gmail.com", role: "Sr. Frontend Dev", status: "Active",   dob: "12/03/1995", region: "North",   joined: "Jan 2022", avatar: "PS" },
  { id: "EMP002", name: "Arjun Mehta",   email: "test2@gmail.com", role: "Marketing Lead",   status: "On Leave", dob: "05/07/1990", region: "West",    joined: "Mar 2021", avatar: "AM" },
  { id: "EMP003", name: "Sara Ahmed",    email: "test3@gmail.com", role: "UX Designer",      status: "Active",   dob: "22/11/1997", region: "South",   joined: "Jul 2023", avatar: "SA" },
  { id: "EMP004", name: "Ravi Kumar",    email: "test4@gmail.com", role: "DevOps Engineer",  status: "Active",   dob: "08/01/1993", region: "East",    joined: "Jun 2024", avatar: "RK" },
  { id: "EMP005", name: "Meera Nair",    email: "test5@gmail.com", role: "Finance Analyst",  status: "Active",   dob: "30/09/1988", region: "Central", joined: "Nov 2020", avatar: "MN" },
];

export const QUICK_ACTIONS = [
  { label: "Add Employee", icon: UserPlus, color: "blue" },
  { label: "Create Dept.", icon: Building2, color: "violet" },
  { label: "Approve Leave", icon: CheckCircle, color: "emerald" },
  { label: "Gen. Report", icon: Download, color: "amber" },
];