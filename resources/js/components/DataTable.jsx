import {
    ArrowDownAZ,
    ArrowDownUp,
    ArrowUpAZ,
    ChevronLeft,
    ChevronRight,
    Download,
    LayoutGrid,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Table2,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const getInitialViewMode = () => {
    if (typeof window === 'undefined') {
        return 'table';
    }

    return window.innerWidth < 768 ? 'card' : 'table';
};

const getTextValue = (value) => {
    if (value === null || value === undefined || value === false) {
        return '';
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value.map(getTextValue).join(' ');
    }

    if (React.isValidElement(value)) {
        return getTextValue(value.props?.children);
    }

    if (typeof value === 'object' && value.props?.children) {
        return getTextValue(value.props.children);
    }

    return '';
};

const getComparableValue = (value, dataType) => {
    const text = getTextValue(value).trim();

    if (dataType === 'number') {
        const numeric = Number(text.replace(/[^0-9.-]/g, ''));
        return Number.isNaN(numeric) ? 0 : numeric;
    }

    return text.toLowerCase();
};

const isActionColumn = (column) => /action/i.test(column.selector) || /action/i.test(column.name);

const DataTable = ({
    columns = [],
    emptyInfo = null,
    data = [],
    globalFilter = [],
    theadClassName = '',
    thClassName = '',
    tdClassName = '',
    tbodyClassName = '',
    tableClassName = '',
    pagination = true,
    exportable = true,
    selectedIds,
    setSelectedIds,
    selectable = false,
    handleChanges,
}) => {
    const tableData = Array.isArray(data) ? data : [];
    const [sortConfig, setSortConfig] = useState({ columnKey: null, direction: 'asc' });
    const [globalSearch, setGlobalSearch] = useState('');
    const [columnFilters, setColumnFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState(getInitialViewMode);

    const searchableColumns = useMemo(() => {
        const explicitFilters = Array.isArray(globalFilter) ? globalFilter.filter(Boolean) : [];

        if (explicitFilters.length > 0) {
            return explicitFilters;
        }

        return columns.filter((column) => !isActionColumn(column)).map((column) => column.selector);
    }, [columns, globalFilter]);

    const filterColumns = useMemo(() => columns.filter((column) => !isActionColumn(column) && column.filterable !== false), [columns]);

    const selectedIdList = Array.isArray(selectedIds) ? selectedIds : selectedIds?.selectedIds || [];

    useEffect(() => {
        const handleResize = () => {
            setViewMode((currentMode) => {
                if (window.innerWidth < 768) {
                    return 'card';
                }

                return currentMode === 'card' ? 'card' : 'table';
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [globalSearch, columnFilters, rowsPerPage, tableData.length]);

    useEffect(() => {
        if (typeof handleChanges === 'function') {
            handleChanges(selectedIds);
        }
    }, [selectedIds, handleChanges]);

    const filteredData = useMemo(() => {
        const search = globalSearch.trim().toLowerCase();
        const activeColumnFilters = Object.entries(columnFilters).filter(([, value]) => value.trim() !== '');

        return tableData.filter((item) => {
            const matchesSearch = !search || searchableColumns.some((selector) => getTextValue(item?.[selector]).toLowerCase().includes(search));

            const matchesFilters = activeColumnFilters.every(([selector, value]) =>
                getTextValue(item?.[selector]).toLowerCase().includes(value.toLowerCase()),
            );

            return matchesSearch && matchesFilters;
        });
    }, [tableData, globalSearch, columnFilters, searchableColumns]);

    const sortedData = useMemo(() => {
        if (!sortConfig.columnKey) {
            return filteredData;
        }

        const column = columns.find((col) => col.selector === sortConfig.columnKey);

        return [...filteredData].sort((a, b) => {
            const aValue = getComparableValue(a?.[sortConfig.columnKey], column?.dataType);
            const bValue = getComparableValue(b?.[sortConfig.columnKey], column?.dataType);

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return sortConfig.direction === 'asc' ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue));
        });
    }, [filteredData, sortConfig, columns]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));
    const paginatedData = useMemo(
        () => sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage),
        [sortedData, currentPage, rowsPerPage],
    );

    const firstVisibleRow = sortedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
    const lastVisibleRow = Math.min(currentPage * rowsPerPage, sortedData.length);
    const hasActiveFilters = globalSearch.trim() !== '' || Object.values(columnFilters).some((value) => value.trim() !== '');

    const actionColumn = columns.find(isActionColumn);
    const primaryColumn = columns.find((column) => !isActionColumn(column));

    const updateSelection = (nextIds) => {
        if (typeof setSelectedIds !== 'function') {
            return;
        }

        if (Array.isArray(selectedIds)) {
            setSelectedIds(nextIds);
            return;
        }

        setSelectedIds((prevState) => ({
            ...prevState,
            selectedIds: nextIds,
        }));
    };

    const isSortableColumn = (column) => column.sortable !== false && !isActionColumn(column);

    const handleSort = (column) => {
        if (!isSortableColumn(column)) {
            return;
        }

        setSortConfig((current) => ({
            columnKey: column.selector,
            direction: current.columnKey === column.selector && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleColumnFilter = (selector, value) => {
        setColumnFilters((current) => ({
            ...current,
            [selector]: value,
        }));
    };

    const resetFilters = () => {
        setGlobalSearch('');
        setColumnFilters({});
        setSortConfig({ columnKey: null, direction: 'asc' });
    };

    const handlePageChange = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    };

    const handleSelectAll = (event) => {
        updateSelection(event.target.checked ? paginatedData.map((row) => row.id).filter(Boolean) : []);
    };

    const handleRowSelect = (event, rowId) => {
        if (!rowId) {
            return;
        }

        updateSelection(event.target.checked ? Array.from(new Set([...selectedIdList, rowId])) : selectedIdList.filter((id) => id !== rowId));
    };

    const exportToCSV = () => {
        const csvRows = [
            columns.map((col) => `"${String(col.name).replace(/"/g, '""')}"`).join(','),
            ...sortedData.map((row) => columns.map((col) => `"${getTextValue(row[col.selector]).replace(/"/g, '""')}"`).join(',')),
        ];
        const csvContent = `data:text/csv;charset=utf-8,${csvRows.join('\n')}`;
        const link = document.createElement('a');
        link.href = encodeURI(csvContent);
        link.setAttribute('download', 'optivest-table.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const isAllSelected = paginatedData.length > 0 && paginatedData.every((row) => row.id && selectedIdList.includes(row.id));

    const SortIcon = ({ column }) => {
        if (!isSortableColumn(column)) {
            return null;
        }

        if (sortConfig.columnKey !== column.selector) {
            return <ArrowDownUp className="size-3.5 text-[#A4A7AE]" />;
        }

        return sortConfig.direction === 'asc' ? (
            <ArrowDownAZ className="size-3.5 text-[#5042DA]" />
        ) : (
            <ArrowUpAZ className="size-3.5 text-[#5042DA]" />
        );
    };

    return (
        <div className="w-full overflow-hidden rounded-[20px] border border-[#E9EAEB] bg-white shadow-[0_14px_40px_rgba(10,13,18,0.04)]">
            <div className="border-b border-[#E9EAEB] bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#A4A7AE]" />
                        <input
                            type="search"
                            value={globalSearch}
                            onChange={(event) => setGlobalSearch(event.target.value)}
                            placeholder="Search records"
                            className="h-11 w-full rounded-[10px] border border-[#D5D7DA] bg-white pr-4 pl-10 text-[16px] text-[#0A0D12] shadow-sm transition outline-none focus:border-[#5042DA] focus:ring-2 focus:ring-[#5042DA]/15 lg:text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setFiltersOpen((open) => !open)}
                            className={`inline-flex h-11 items-center gap-2 rounded-[10px] border px-4 text-sm font-semibold transition ${
                                filtersOpen || hasActiveFilters
                                    ? 'border-[#5042DA] bg-[#F6F5FF] text-[#5042DA]'
                                    : 'border-[#D5D7DA] bg-white text-[#414651] hover:border-[#5042DA]/50'
                            }`}
                        >
                            <SlidersHorizontal className="size-4" />
                            Filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#D5D7DA] bg-white px-4 text-sm font-semibold text-[#414651] transition hover:border-[#5042DA]/50 hover:text-[#5042DA]"
                            >
                                <RotateCcw className="size-4" />
                                Reset
                            </button>
                        )}

                        {exportable && (
                            <button
                                type="button"
                                onClick={exportToCSV}
                                className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-[#D5D7DA] bg-white px-4 text-sm font-semibold text-[#414651] transition hover:border-[#5042DA]/50 hover:text-[#5042DA]"
                            >
                                <Download className="size-4" />
                                Export
                            </button>
                        )}

                        <div className="hidden rounded-[10px] border border-[#D5D7DA] bg-white p-1 md:flex">
                            <button
                                type="button"
                                onClick={() => setViewMode('table')}
                                className={`flex size-9 items-center justify-center rounded-[8px] transition ${
                                    viewMode === 'table' ? 'bg-[#5042DA] text-white' : 'text-[#717680] hover:bg-[#F5F5F5]'
                                }`}
                                aria-label="Table view"
                            >
                                <Table2 className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('card')}
                                className={`flex size-9 items-center justify-center rounded-[8px] transition ${
                                    viewMode === 'card' ? 'bg-[#5042DA] text-white' : 'text-[#717680] hover:bg-[#F5F5F5]'
                                }`}
                                aria-label="Card view"
                            >
                                <LayoutGrid className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {filtersOpen && (
                    <div className="mt-4 grid gap-3 border-t border-[#F0F0F0] pt-4 sm:grid-cols-2 xl:grid-cols-4">
                        {filterColumns.map((column) => (
                            <label key={column.selector} className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold tracking-normal text-[#717680] uppercase">{column.name}</span>
                                <input
                                    type="text"
                                    value={columnFilters[column.selector] || ''}
                                    onChange={(event) => handleColumnFilter(column.selector, event.target.value)}
                                    placeholder={`Filter ${column.name}`}
                                    className="h-10 rounded-[10px] border border-[#D5D7DA] bg-white px-3 text-[16px] text-[#0A0D12] transition outline-none placeholder:text-[#A4A7AE] focus:border-[#5042DA] focus:ring-2 focus:ring-[#5042DA]/15 lg:text-sm"
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {viewMode === 'table' ? (
                <div className="hidden overflow-x-auto md:block">
                    <table className={`min-w-full table-auto border-collapse bg-white ${tableClassName}`}>
                        <thead className={`bg-[#F8F9FA] text-left text-xs text-[#717680] uppercase ${theadClassName}`}>
                            <tr>
                                {selectable && (
                                    <th className="w-12 border-b border-[#DBDADE] px-4 py-4">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={isAllSelected}
                                            className="size-4 rounded border-[#D5D7DA] accent-[#5042DA]"
                                        />
                                    </th>
                                )}
                                {columns.map((column) => (
                                    <th key={column.selector} className={`border-b border-[#DBDADE] px-4 py-4 font-medium ${thClassName}`}>
                                        <button
                                            type="button"
                                            onClick={() => handleSort(column)}
                                            className={`inline-flex items-center gap-2 text-left uppercase ${
                                                isSortableColumn(column) ? 'cursor-pointer hover:text-[#5042DA]' : 'cursor-default'
                                            }`}
                                        >
                                            {column.name}
                                            <SortIcon column={column} />
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {paginatedData.length > 0 ? (
                            <tbody className={`divide-y divide-[#F0F0F0] ${tbodyClassName}`}>
                                {paginatedData.map((row, index) => (
                                    <tr
                                        key={row.id || index}
                                        className={`bg-white text-sm text-[#181D27] transition hover:bg-[#FAFAFF] ${
                                            row.id && selectedIdList.includes(row.id) ? 'bg-[#F6F5FF]' : ''
                                        }`}
                                    >
                                        {selectable && (
                                            <td className="px-4 py-5">
                                                <input
                                                    type="checkbox"
                                                    checked={row.id ? selectedIdList.includes(row.id) : false}
                                                    onChange={(event) => handleRowSelect(event, row.id)}
                                                    className="size-4 rounded border-[#D5D7DA] accent-[#5042DA]"
                                                />
                                            </td>
                                        )}
                                        {columns.map((column) => (
                                            <td key={column.selector} className={`px-4 py-5 align-middle ${tdClassName}`}>
                                                {row[column.selector]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-14 text-center">
                                        {emptyInfo || (
                                            <div className="mx-auto max-w-sm">
                                                <p className="text-base font-semibold text-[#181D27]">No records found</p>
                                                <p className="mt-1 text-sm text-[#717680]">Try another search or clear your filters.</p>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            ) : (
                <div className="grid gap-3 bg-[#FAFAFA] p-3 sm:grid-cols-2 xl:grid-cols-3">
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <article
                                key={row.id || index}
                                className="rounded-[18px] border border-[#E9EAEB] bg-white p-4 shadow-[0_10px_28px_rgba(10,13,18,0.05)]"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3 border-b border-[#F0F0F0] pb-3">
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium tracking-normal text-[#717680] uppercase">
                                            {primaryColumn?.name || 'Record'}
                                        </p>
                                        <div className="mt-1 truncate text-base font-semibold text-[#181D27]">
                                            {primaryColumn ? row[primaryColumn.selector] : `Record ${index + 1}`}
                                        </div>
                                    </div>
                                    {actionColumn && <div className="shrink-0">{row[actionColumn.selector]}</div>}
                                </div>

                                <dl className="grid gap-3">
                                    {columns
                                        .filter((column) => !isActionColumn(column) && column.selector !== primaryColumn?.selector)
                                        .map((column) => (
                                            <div key={column.selector} className="grid grid-cols-[minmax(92px,42%)_1fr] gap-3">
                                                <dt className="text-xs font-medium tracking-normal text-[#717680] uppercase">{column.name}</dt>
                                                <dd className="min-w-0 text-right text-sm font-medium text-[#181D27]">{row[column.selector]}</dd>
                                            </div>
                                        ))}
                                </dl>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-[18px] border border-dashed border-[#D5D7DA] bg-white px-6 py-12 text-center sm:col-span-2 xl:col-span-3">
                            {emptyInfo || (
                                <>
                                    <p className="text-base font-semibold text-[#181D27]">No records found</p>
                                    <p className="mt-1 text-sm text-[#717680]">Try another search or clear your filters.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {pagination && (
                <div className="flex flex-col gap-3 border-t border-[#E9EAEB] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm text-[#717680]">
                        <span>Rows</span>
                        <select
                            value={rowsPerPage}
                            onChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
                            className="h-10 rounded-[10px] border border-[#D5D7DA] bg-white px-3 text-sm text-[#181D27] outline-none focus:border-[#5042DA] focus:ring-2 focus:ring-[#5042DA]/15"
                        >
                            {[5, 10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span>
                            {firstVisibleRow}-{lastVisibleRow} of {sortedData.length}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#D5D7DA] bg-white px-3 text-sm font-semibold text-[#414651] transition hover:border-[#5042DA]/50 hover:text-[#5042DA] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </button>
                        <span className="rounded-[10px] bg-[#F6F5FF] px-3 py-2 text-sm font-semibold text-[#5042DA]">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#D5D7DA] bg-white px-3 text-sm font-semibold text-[#414651] transition hover:border-[#5042DA]/50 hover:text-[#5042DA] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
