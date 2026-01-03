import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DataTable = ({ columns, data, searchable = true }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- SORTING ---------------- */
  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  /* ---------------- FILTERING ---------------- */
  const filteredData = React.useMemo(() => {
    return sortedData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="w-full bg-[#23272b] border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full mt-[100px]">
      {/* ---------------- SEARCH ---------------- */}
      {searchable && (
        <div className="p-4 border-b border-slate-800 flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
        </div>
      )}

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          {/* ---------- HEADER ---------- */}
          <thead className="bg-blue-600 text-white uppercase text-xs font-bold sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => requestSort(col.key)}
                  className={cn(
                    "px-6 py-3 cursor-pointer hover:bg-blue-700 whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  <div className="flex items-center gap-1 justify-between">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* ---------- BODY ---------- */}
          <tbody className="divide-y divide-slate-800/50">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    index % 2 === 0 ? "bg-[#1f2327]" : "bg-[#2a2f34]",
                    "hover:bg-slate-800 transition-colors"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={`${index}-${col.key}`}
                      className={cn(
                        "px-6 py-3 whitespace-nowrap text-slate-200",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500 bg-[#1f2327]"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>

          <tfoot className="sticky bottom-0 z-10">
            <tr className="bg-blue-600 text-white font-bold text-sm">
              {columns.map((col) => {
                // Place "Totals:" under FROM column
                if (col.key === "from") {
                  return (
                    <td
                      key={col.key}
                      className="px-6 py-3 text-right whitespace-nowrap"
                    >
                      Totals:
                    </td>
                  );
                }

                // Numeric total columns
                if (col.footer) {
                  return (
                    <td
                      key={col.key}
                      className="px-6 py-3 text-right whitespace-nowrap"
                    >
                      {col.footer(filteredData)}
                    </td>
                  );
                }

                // Empty footer cells
                return (
                  <td key={col.key} className="px-6 py-3 whitespace-nowrap" />
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ---------------- PAGINATION ---------------- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing{" "}
          {Math.min((currentPage - 1) * pageSize + 1, filteredData.length)} to{" "}
          {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
          {filteredData.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-200 font-medium">
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
