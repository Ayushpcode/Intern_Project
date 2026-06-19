import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeesByRegion, insertTransactionData } from "../redux/slices//dataAction";
import { resetInsertState, clearEmployees } from "../redux/slices/dataSlice";

const INITIAL_FORM = {
  region: "", emp_id: "", deport: "", acc_number: "",
  acc_name: "", trx_date: "", invoice_number: "", volume: "", value: "",
};

export default function DataEntryPage() {
  const dispatch = useDispatch();
  const { employees, empLoading, insertLoading, insertSuccess, insertError } = useSelector(s => s.transaction);

  const [form, setForm] = useState(INITIAL_FORM);
  const [toast, setToast] = useState(null);

  
  useEffect(() => {
    if (!form.region.trim()) {
      dispatch(clearEmployees());
      setForm(f => ({ ...f, emp_id: "" }));
      return;
    }
    const timer = setTimeout(() => {
      dispatch(getEmployeesByRegion(form.region.trim()));
      setForm(f => ({ ...f, emp_id: "" }));
    }, 600);
    return () => clearTimeout(timer);
  }, [form.region]);

  // Toast on success/error
  useEffect(() => {
    if (insertSuccess) {
      showToast("success", "Record inserted successfully!");
      setForm(INITIAL_FORM);
      dispatch(clearEmployees());
      dispatch(resetInsertState());
    }
    if (insertError) {
      showToast("error", insertError);
      dispatch(resetInsertState());
    }
  }, [insertSuccess, insertError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.emp_id) return showToast("error", "Please select an employee.");
    dispatch(insertTransactionData({
      ...form,
      acc_number:     Number(form.acc_number),
      invoice_number: Number(form.invoice_number),
      volume:         Number(form.volume),
      value:          Number(form.value),
    }));
  };

  const fields = [
    { name: "deport",         label: "Deport",            type: "text",   placeholder: "Enter deport" },
    { name: "acc_number",     label: "Account Number",    type: "number", placeholder: "Enter account number" },
    { name: "acc_name",       label: "Account Name",      type: "text",   placeholder: "Enter account name" },
    { name: "trx_date",       label: "Transaction Date",  type: "date",   placeholder: "" },
    { name: "invoice_number", label: "Invoice Number",    type: "number", placeholder: "Enter invoice number" },
    { name: "volume",         label: "Volume",            type: "number", placeholder: "Enter volume" },
    { name: "value",          label: "Value",             type: "number", placeholder: "Enter value" },
  ];

  return (
    <div className="space-y-5 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
          ${toast.type === "success"
            ? "bg-green-50 text-green-700 ring-1 ring-green-200"
            : "bg-red-50 text-red-700 ring-1 ring-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Data Entry</h2>
        <p className="text-xs text-slate-400 mt-0.5">Fill in the transaction details below</p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Region + Employee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Region</label>
              <input
                name="region" value={form.region} onChange={handleChange}
                placeholder="e.g. North" required
                className="px-3 py-2 text-xs rounded-lg ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Employee</label>
              <div className="relative">
                <select
                  name="emp_id" value={form.emp_id} onChange={handleChange}
                  required disabled={empLoading || employees.length === 0}
                  className="w-full px-3 py-2 text-xs rounded-lg ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                >
                  <option value="">
                    {empLoading ? "Loading..." : employees.length === 0 && form.region ? "No employees found" : "Select employee"}
                  </option>
                  {employees.map(emp => (
                    <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name} ({emp.emp_id})</option>
                  ))}
                </select>
                {empLoading && <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 animate-spin" />}
              </div>
            </div>
          </div>

          {/* Remaining fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
                <input
                  name={name} type={type} value={form[name]}
                  onChange={handleChange} placeholder={placeholder} required
                  className="px-3 py-2 text-xs rounded-lg ring-1 ring-slate-200 dark:ring-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-300 outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit" disabled={insertLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
              {insertLoading && <Loader2 size={13} className="animate-spin" />}
              {insertLoading ? "Submitting..." : "Submit Record"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}