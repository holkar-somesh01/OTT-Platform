import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

const DataTable = ({
    columns,
    data = [],
    meta, // Optional metadata from server { total, page, limit, totalPages }
    isLoading,
    searchPlaceholder = "Search...",
    searchKeys = [],
    actions,
    serverSide = false,
    onServerRequest // (params) => void
}) => {
    // Only use local state if not serverSide, otherwise use props or trigger requests
    // Actually, local state can still drive the UI, but effect triggers callback

    // We should initialize state from meta if provided?
    // Let's keep local state for inputs, but trigger callbacks.

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // If serverSide, we use debouncing for search

    React.useEffect(() => {
        if (serverSide && onServerRequest) {
            const timeoutId = setTimeout(() => {
                onServerRequest({
                    page: currentPage,
                    limit: pageSize,
                    search: searchTerm,
                    sortBy: sortConfig.key,
                    sortOrder: sortConfig.direction
                });
            }, 500); // 500ms debounce
            return () => clearTimeout(timeoutId);
        }
    }, [currentPage, pageSize, searchTerm, sortConfig, serverSide]);

    // Derived or Source Data
    // If serverSide, 'data' prop IS the current page data.
    // If clientSide, we ignore 'meta' prop and do local slicing.

    const finalData = useMemo(() => {
        if (serverSide) return data;

        // Client Side Logic
        let processed = [...data];

        // Filter
        if (searchTerm) {
            processed = processed.filter(item => {
                return searchKeys.some(key => {
                    const value = item[key];
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }

        // Sort
        if (sortConfig.key) {
            processed.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processed;
    }, [data, searchTerm, searchKeys, sortConfig, serverSide]);

    const finalPaginatedData = useMemo(() => {
        if (serverSide) return data; // Server already sliced it
        const startIndex = (currentPage - 1) * pageSize;
        return finalData.slice(startIndex, startIndex + pageSize);
    }, [finalData, currentPage, pageSize, serverSide, data]);

    const totalItems = serverSide ? (meta?.total || 0) : finalData.length;
    const finalTotalPages = serverSide ? (meta?.totalPages || 0) : Math.ceil(totalItems / pageSize);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        if (serverSide) setCurrentPage(1); // Reset to page 1 on sort change usually
    };

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-gray-600" />;
        if (sortConfig.direction === 'asc') return <ArrowUp size={14} className="text-accent" />;
        return <ArrowDown size={14} className="text-accent" />;
    };

    if (isLoading) return null;

    return (
        <div className="flex flex-col h-full bg-secondary rounded-xl border border-border shadow-xl overflow-hidden">
            {/* Header / Search Controls */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="w-full bg-primary border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent transition-colors text-primary-text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                {actions && <div className="w-full sm:w-auto flex justify-end">{actions}</div>}
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto relative">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-primary/50 text-text-secondary text-xs uppercase tracking-wider sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`p-4 font-medium transition-colors ${col.sortable ? 'cursor-pointer hover:text-primary-text' : ''}`}
                                    onClick={() => col.sortable && col.accessor && requestSort(col.accessor)}
                                >
                                    <div className="flex items-center gap-2">
                                        {col.header}
                                        {col.sortable && getSortIcon(col.accessor)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm divide-opacity-50">
                        {finalPaginatedData.length > 0 ? (
                            finalPaginatedData.map((item, rowIndex) => (
                                <tr key={item.id || rowIndex} className="hover:bg-hover transition-colors group">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="p-4 text-text-secondary group-hover:text-primary-text transition-colors">
                                            {col.render ? col.render(item) : (item[col.accessor] || '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-text-secondary">
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-primary/95 backdrop-blur border-t border-border p-3 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                    <span>Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="bg-secondary border border-border rounded px-2 py-1 focus:outline-none focus:border-accent text-primary-text"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span className="hidden sm:inline ml-2">
                        Showing {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="sm:hidden mr-2">
                        {currentPage} / {finalTotalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1 rounded hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="hidden sm:flex gap-1">
                        {[...Array(finalTotalPages)].map((_, i) => {
                            const page = i + 1;
                            if (Math.abs(currentPage - page) <= 1 || page === 1 || page === finalTotalPages) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${currentPage === page
                                            ? 'bg-accent text-white'
                                            : 'hover:bg-hover'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (Math.abs(currentPage - page) === 2) {
                                return <span key={page} className="w-8 flex items-center justify-center">...</span>;
                            }
                            return null;
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, finalTotalPages))}
                        disabled={currentPage === finalTotalPages || finalTotalPages === 0}
                        className="p-1 rounded hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
