import { getProgressOptions, getSiteOptions, getStatusOptions } from "@/services";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EventsRequest, FilterOption } from "@/services/types/sample";
import { DataTable, DateRange, Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@plug-siteguard/ui";
import { useFilter } from "@/services/useFilter";
import { useEventsData } from "./hook/useEventsData";
import { EventsFilter } from "./components/EventsFilter";
import { eventsColumns } from "./utils/eventsUtil";
import { FolderDown } from "lucide-react";

export default function EventsPage() {
  const [filters, setFilters] = useState({
        location: "ALL",
        progress: "ALL",
        status: "ALL",
        keyword: "",
    });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const [site, setSite] = useState<FilterOption[]>([]);
  const [progress, setProgress] = useState<FilterOption[]>([]);
  const [status, setStatus] = useState<FilterOption[]>([]);

  useEffect(() => {
    getSiteOptions().then(setSite);
    getProgressOptions().then(setProgress);
    getStatusOptions().then(setStatus);
  }, []);

  const { params } = useFilter<typeof filters, EventsRequest>(filters, dateRange, currentPage);
  const { events, totalPages, fetchEvents } = useEventsData();
  
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
      fetchEvents(params);
  }, [currentPage]);

  const handleSearch = useCallback(async () => {
        setCurrentPage(1);
        fetchEvents(params);
  }, [params, fetchEvents]);

  const handleFilterClear = useCallback((key?: string, value?: string) => {
    if (key && value) {
            setFilters(prev => ({ ...prev, [key]: value }));
        } else {
            setFilters({
                location: 'ALL',
                progress: 'ALL',
                status: 'ALL',
                keyword: '',
            });
            setDateRange(undefined);
        }
        setCurrentPage(1);
  }, []);

  return (
    <div className="h-auto p-9 space-y-8 bg-white">
      <EventsFilter
        filters={filters}
        onFilterChange={handleFilterClear}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSearch={handleSearch}
        siteOptions={site}
        progressOptions={progress}
        statusOptions={status}
      />

      <div className="flex flex-col h-full gap-2">
          {events.length === 0 ? (
              <div className="flex items-center justify-center">
                  <p className="text-gray-500">데이터가 없습니다.</p>
              </div>
          ) : (
              <DataTable columns={eventsColumns} data={events} />
          )}
          <div className="flex justify-end">
            <div className="flex items-center gap-1 cursor-pointer">
                <FolderDown className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-400 text-xs font-normal font-['Pretendard']">데이터 다운로드</span>
            </div>
          </div>
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
