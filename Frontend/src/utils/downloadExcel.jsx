// utils/downloadExcel.js
import * as XLSX from "xlsx";

export const downloadEmployeeExcel = (data, userName) => {
  if (!data) return;

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Summary ──────────────────────────────────────────────
  const summaryRows = [
    ["Employee Report"],
    [],
    ["Name", data.employee?.emp_name ?? userName ?? "—"],
    ["Email", data.employee?.email ?? "—"],
    ["Region", data.employee?.region ?? "—"],
    ["Role", data.employee?.role ?? "—"],
    ["Status", data.employee?.status ?? "—"],
    [],
    ["── Stats ──"],
    ["Total Transactions", data.stats?.totalTransactions ?? 0],
    ["Total Volume", data.stats?.totalVolume ?? 0],
    ["Total Value (₹)", data.stats?.totalValue ?? 0],
    [],
    ["── This Month ──"],
    ["Transactions (This Month)", data.stats?.thisMonth?.transactions ?? 0],
    ["Volume (This Month)", data.stats?.thisMonth?.volume ?? 0],
    ["Value (This Month) (₹)", data.stats?.thisMonth?.value ?? 0],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // ── Sheet 2: Recent Transactions ──────────────────────────────────
  const trxHeaders = [
    "TRX ID", "Invoice No.", "Account Name", "Account No.",
    "Region", "Deport", "Volume", "Value (₹)", "Date"
  ];

  const trxRows = (data.recentTransactions ?? []).map(t => [
    t.trx_id,
    t.invoice_number,
    t.acc_name,
    t.acc_number,
    t.region,
    t.deport,
    t.volume,
    t.value,
    t.trx_date ? new Date(t.trx_date).toLocaleDateString("en-IN") : "—",
  ]);

  const trxSheet = XLSX.utils.aoa_to_sheet([trxHeaders, ...trxRows]);
  trxSheet["!cols"] = [
    { wch: 10 }, { wch: 14 }, { wch: 24 }, { wch: 14 },
    { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 14 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, trxSheet, "Transactions");

  // ── Download ──────────────────────────────────────────────────────
  const fileName = `${(userName ?? "employee").replace(/\s+/g, "_")}_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
};