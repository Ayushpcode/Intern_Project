// components/PlaceholderPage.jsx
import { NAV_ITEMS } from "../Constant";

export default function PlaceholderPage({ id }) {
  const item = NAV_ITEMS.find(n => n.id === id);
  return (
    <div className="flex flex-col items-center justify-center h-64 rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-100 dark:ring-slate-700">
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 mb-4">
        {item && <item.icon size={28} className="text-slate-400" />}
      </div>
      <p className="text-base font-bold text-slate-700 dark:text-slate-200">{item?.label}</p>
      <p className="text-sm text-slate-400 mt-1">This section is under construction</p>
    </div>
  );
}