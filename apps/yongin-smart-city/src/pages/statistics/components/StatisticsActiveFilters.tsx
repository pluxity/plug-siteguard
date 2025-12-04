import { Badge, Button } from "@plug-siteguard/ui";
import { XIcon } from "lucide-react";
import { EventLevel, getLevelType } from "../utils/statisticsUtil";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface StatisticsActiveFiltersProps {
    filters: {
        location: string;
        progress: string;
        status: string;
        severity: string;
        keyword: string;
    };
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onFilterChange: (key: string, value: string) => void;
    onClearAll: () => void;
}

export function StatisticsActiveFilters({
    filters,
    onFilterChange,
    onClearAll,
    dateRange,
    onDateRangeChange,
}: StatisticsActiveFiltersProps) {
    const activeFiltersCount =
        (filters.location !== "ALL" ? 1 : 0) +
        (filters.progress !== "ALL" ? 1 : 0) +
        (filters.status !== "ALL" ? 1 : 0) +
        (filters.severity !== "ALL" ? 1 : 0) +
        (dateRange ? 1 : 0);

    if (activeFiltersCount === 0) return null;

    return (
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">적용된 필터:</span>

            {filters.location !== "ALL" && (
                <Badge variant="secondary" className="gap-1">
                    {filters.location}
                    <Button
                        onClick={() => onFilterChange("location", "ALL")}
                        className="rounded-full h-4 w-4 !p-0 text-xs"
                        variant="ghost"
                        aria-label="공원 필터 제거"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            )}

            {filters.progress !== "ALL" && (
                <Badge variant="secondary" className="gap-1">
                    {filters.progress}
                    <Button
                        onClick={() => onFilterChange("progress", "ALL")}
                        className="rounded-full h-4 w-4 !p-0 text-xs"
                        variant="ghost"
                        aria-label="진행도 필터 제거"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            )}

            {filters.status !== "ALL" && (
                <Badge variant="secondary" className="gap-1">
                    {filters.status}
                    <Button
                        onClick={() => onFilterChange("status", "ALL")}
                        className="rounded-full h-4 w-4 !p-0 text-xs"
                        variant="ghost"
                        aria-label="상태 필터 제거"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            )}

            {filters.severity !== "ALL" && (
                <Badge variant="secondary" className="gap-1">
                    {getLevelType(filters.severity as EventLevel)}
                    <Button
                        onClick={() => onFilterChange("severity", "ALL")}
                        className="rounded-full h-4 w-4 !p-0 text-xs"
                        variant="ghost"
                        aria-label="중요도 필터 제거"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            )}

            {dateRange && (
                <Badge variant="secondary" className="gap-1">
                    {dateRange.from && format(dateRange.from, 'yyyy-MM-dd')}
                    ~
                    {dateRange.to && format(dateRange.to, 'yyyy-MM-dd')}
                    <Button
                        onClick={() => onDateRangeChange(undefined)}
                        className="rounded-full h-4 w-4 !p-0 text-xs"
                        variant="ghost"
                        aria-label="날짜 필터 제거"
                    >
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            )}

            

            <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="ml-auto"
            >
                모두 지우기
            </Button>
        </div>
    );
}
