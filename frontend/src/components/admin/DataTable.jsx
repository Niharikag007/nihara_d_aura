import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import useAdminStore from '../../store/useAdminStore';

export default function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  selectable = false,
  selectedIds = [],
  onSelect,
  onSelectAll,
  searchPlaceholder = 'Search...',
  searchKeys = [],
  pageSize = 10,
  actions = null,
  emptyMessage = 'No records found',
}) {
  const darkMode = useAdminStore(s => s.darkMode);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [page, setPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(item => {
      if (searchKeys.length > 0) {
        return searchKeys.some(k => {
          const val = item[k];
          return val != null && String(val).toLowerCase().includes(q);
        });
      }
      return Object.values(item).some(
        val => val != null && String(val).toLowerCase().includes(q)
      );
    });
  }, [data, search, searchKeys]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key) => {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc');
      else {
        setSortKey(null);
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const allOnPageSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.includes(item[keyField]));
  const someOnPageSelected = paginatedData.some(item => selectedIds.includes(item[keyField]));

  const handleSelectAllCurrent = (e) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked, paginatedData.map(d => d[keyField]));
    }
  };

  return (
    <div
      className={`rounded-[18px] border transition-all duration-200 shadow-sm overflow-hidden ${
        darkMode ? 'bg-[#181416] border-white/10' : 'bg-white border-[#e9e3dd]'
      }`}
    >
      {/* Table Header controls */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-inherit">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-[#b58a2a] ${
              darkMode
                ? 'bg-[#121010] border-white/10 text-white placeholder-stone-500'
                : 'bg-[#faf9f7] border-stone-200 text-stone-900 placeholder-stone-400'
            }`}
          />
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr
              className={`border-b border-inherit text-xs font-semibold ${
                darkMode ? 'bg-white/[0.02] text-stone-400' : 'bg-[#faf9f7] text-stone-600'
              }`}
            >
              {selectable && (
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    checked={allOnPageSelected}
                    ref={el => {
                      if (el) el.indeterminate = !allOnPageSelected && someOnPageSelected;
                    }}
                    onChange={handleSelectAllCurrent}
                    className="rounded border-stone-300 text-[#b58a2a] focus:ring-[#b58a2a] cursor-pointer"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`py-3.5 px-4 whitespace-nowrap ${
                    col.sortable ? 'cursor-pointer select-none hover:text-[#b58a2a]' : ''
                  } ${col.className || ''}`}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-stone-400">
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-[#b58a2a]" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-[#b58a2a]" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-sm text-stone-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const id = row[keyField];
                const isSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id || idx}
                    className={`transition-colors ${
                      isSelected
                        ? darkMode ? 'bg-[#b58a2a]/10' : 'bg-[#fcf9f2]'
                        : darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-[#faf9f7]'
                    }`}
                  >
                    {selectable && (
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select row ${id}`}
                          checked={isSelected}
                          onChange={(e) => onSelect?.(id, e.target.checked)}
                          className="rounded border-stone-300 text-[#b58a2a] focus:ring-[#b58a2a] cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={`py-3 px-4 ${col.cellClassName || ''}`}>
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div
        className={`p-4 flex flex-col sm:flex-row gap-3 items-center justify-between text-xs border-t border-inherit ${
          darkMode ? 'text-stone-400' : 'text-stone-500'
        }`}
      >
        <div>
          Showing {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          {selectedIds.length > 0 && ` (${selectedIds.length} selected)`}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-inherit disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-inherit disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
