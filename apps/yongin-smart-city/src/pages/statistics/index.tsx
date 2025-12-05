import {
    DataTable,
    type DateRange,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@plug-siteguard/ui";
import { statisticsColumns } from "./utils/statisticsUtil";
import {useCallback, useEffect, useMemo, useState} from "react";
import { useStatisticsData } from "./hook/useStatisticsData";
import { StatisticsFilter } from "./components/StatisticsFilter";
import { useFilter } from "@/services/useFilter";
import { StatisticsRequest } from "@/services";
import {
    getSiteOptions,
    getProgressOptions,
    getSeverityOptions,
    getStatusOptions,
} from "@/services/sample";
import type { FilterOption } from "@/services/types/sample";

export default function StatisticsPage() {
    const [filters, setFilters] = useState({
        location: "ALL",
        progress: "ALL",
        status: "ALL",
        severity: "ALL",
        keyword: "",
    });

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    const [site, setSite] = useState<FilterOption[]>([]);
    const [progress, setProgress] = useState<FilterOption[]>([]);
    const [severity, setSeverity] = useState<FilterOption[]>([]);
    const [status, setStatus] = useState<FilterOption[]>([]);

    useEffect(() => {
        getSiteOptions().then(setSite);
        getProgressOptions().then(setProgress);
        getSeverityOptions().then(setSeverity);
        getStatusOptions().then(setStatus);
    }, []);
    const { params } = useFilter<typeof filters, StatisticsRequest>(filters, dateRange, currentPage);
    const { statistics, totalPages, fetchStatistics } = useStatisticsData();

    const visiblePages = useMemo(() => {
        const maxVisible = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = startPage + maxVisible - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    }, [currentPage]);

    const handleNextPage = useCallback(() => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    }, [currentPage, totalPages]);

    useEffect(() => {
        fetchStatistics(params);
    }, [currentPage]);

    const handleSearch = useCallback(async () => {
        setCurrentPage(1);
        fetchStatistics(params);
    }, [params, fetchStatistics]);

    const handleFilterClear = useCallback((key?: string, value?: string) => {
        if (key && value) {
            setFilters(prev => ({ ...prev, [key]: value }));
        } else {
            setFilters({
                location: 'ALL',
                progress: 'ALL',
                status: 'ALL',
                severity: 'ALL',
                keyword: '',
            });
            setDateRange(undefined);
        }
        setCurrentPage(1);
    }, []);

    return (
        <div className="h-auto p-9 space-y-8 bg-white">
            <StatisticsFilter
                filters={filters}
                onFilterChange={handleFilterClear}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                onSearch={handleSearch}
                siteOptions={site}
                progressOptions={progress}
                statusOptions={status}
                severityOptions={severity}
            />


            <div className="flex flex-col h-full">
                {statistics.length === 0 ? (
                    <div className="flex items-center justify-center">
                        <p className="text-gray-500">데이터가 없습니다.</p>
                    </div>
                ) : (
                    <DataTable columns={statisticsColumns} data={statistics} />
                )}
            </div>

            {totalPages > 0 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={handlePrevPage} />
                        </PaginationItem>
                        {visiblePages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    onClick={() => setCurrentPage(page)}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={handleNextPage} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}