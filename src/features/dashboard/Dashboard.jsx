import React, { useState } from "react";
import BulkSentPieChart from "../../components/charts/BulkSentPieChart";
import BulkSentBarChart from "../../components/charts/BulkSentBarChart";
import DataTable from "../../components/common/DataTable";
import { Calendar } from "lucide-react";
import moment from "moment";
import Swal from "sweetalert2";

import { useLiveDashboard } from "../../hooks/useLiveDashboard";

// Mock Data for Table
const mockTableData = Array.from({ length: 50 }).map((_, i) => ({
  sentOn: moment().subtract(i, "days").format("YYYY-MM-DD"),
  mailer: ["Puri", "Rahul", "Deependra", "Kishan", "Purohit"][i % 5],
  templateId: 752300 + i,
  interface: "FSOCK SEND SMTP AUTO",
  server: "smtp2",
  offerId: 1,
  domain: `domain${i}.com`,
  from: `user${i}@domain${i}.com`,
  testSent: 0,
  bulkTestSent: 20 + i,
  bulkTest: 1000 * (i + 1),
  error: 0,
}));

const columns = [
  { key: "sentOn", label: "SENT ON" },
  { key: "mailer", label: "MAILER" },
  { key: "templateId", label: "TEMPLATE ID" },
  { key: "interface", label: "INTERFACE" },
  { key: "server", label: "SERVER" },
  { key: "offerId", label: "OFFER ID" },
  { key: "domain", label: "DOMAIN" },
  { key: "from", label: "FROM" },
  { key: "testSent", label: "TEST SENT", className: "text-center" },
  { key: "bulkTestSent", label: "BULK TEST SENT", className: "text-center" },
  { key: "bulkTest", label: "BULK TEST", className: "text-center" },
  { key: "error", label: "ERROR", className: "text-center" },
];

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    from: "02-01-2026",
    to: "02-01-2026",
  });
  const { stats, loading } = useLiveDashboard(); // Use the hook

  // Mock initial values if loading
  const displayStats = loading
    ? { bulkSent: 0, testSent: 0, errors: 0 }
    : stats;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="p-2 rounded border border-slate-800 bg-[#23272b]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            SENDING REPORT
          </h1>

          <div className="flex items-center gap-2 p-2 rounded border border-slate-800">
            <span className="text-slate-400 text-sm">From:</span>
            <div className="relative">
              <input
                type="text"
                value={dateRange.from}
                className="bg-white text-slate-900 px-2 py-1 rounded w-28 text-sm"
                readOnly
              />
              <Calendar className="w-4 h-4 text-slate-500 absolute right-2 top-1.5" />
            </div>
            <span className="text-slate-400 text-sm">To:</span>
            <div className="relative">
              <input
                type="text"
                value={dateRange.to}
                className="bg-white text-slate-900 px-2 py-1 rounded w-28 text-sm"
                readOnly
              />
              <Calendar className="w-4 h-4 text-slate-500 absolute right-2 top-1.5" />
            </div>
            <button
              onClick={() => {
                Swal.fire({
                  title: "Applying Filter",
                  text: `Fetching data from ${dateRange.from} to ${dateRange.to}`,
                  icon: "info",
                  confirmButtonColor: "#3b82f6",
                });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-bold ml-2 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs font-mono border border-cyan-500/20">
            2026-01-02 to 2026-01-02
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-400 text-sm font-medium uppercase">
            Bulk Sent
          </div>
          <div className="text-4xl font-bold text-blue-400 mt-2">
            {displayStats.bulkSent.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-400 text-sm font-medium uppercase">
            Test Sent
          </div>
          <div className="text-4xl font-bold text-green-400 mt-2">
            {displayStats.testSent.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-slate-400 text-sm font-medium uppercase">
            Errors
          </div>
          <div className="text-4xl font-bold text-red-400 mt-2">
            {displayStats.errors.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        {/* Pie Chart Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex-1 min-h-0">
            <BulkSentPieChart />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col">
          <div className="flex-1 min-h-0">
            <BulkSentBarChart />
          </div>
        </div>
      </div>

      {/* Stats Counters (Optional based on UI, but usually good) */}
      {/* <div className="grid grid-cols-3 gap-4"> ... </div> */}

      {/* Main Data Table */}
      <div className="h-[600px]">
        <DataTable columns={columns} data={mockTableData} />
      </div>
    </div>
  );
};

export default Dashboard;
