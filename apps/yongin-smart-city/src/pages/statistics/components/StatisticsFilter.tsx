import {
    Button,
    DatePicker,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    type DateRange,
} from "@plug-siteguard/ui";

interface Option {
    id: string | number;
    name: string;
    description?: string;
}

interface StatisticsFilterProps {
    filters: {
        location: string;
        progress: string;
        status: string;
        severity: string;
        keyword: string;
    };
    onFilterChange: (key: string, value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onSearch: () => void;
    siteOptions: Option[];
    progressOptions: Option[];
    statusOptions: Option[];
    severityOptions: Option[];
}

export function StatisticsFilter({
    filters,
    onFilterChange,
    dateRange,
    onDateRangeChange,
    onSearch,
    siteOptions,
    progressOptions,
    statusOptions,
    severityOptions,
}: StatisticsFilterProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                {/* Location */}
                <Select value={filters.location} onValueChange={(v) => onFilterChange("location", v)}>
                    <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="구역 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체 구역</SelectItem>
                        {siteOptions.map(({ id, name, description }) => (
                            <SelectItem key={id} value={description || name}>
                                {description || name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Progress */}
                <Select value={filters.progress} onValueChange={(v) => onFilterChange("progress", v)}>
                    <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="작업 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체 작업</SelectItem>
                        {progressOptions.map(({ id, name }) => (
                            <SelectItem key={id} value={name}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Status */}
                <Select value={filters.status} onValueChange={(v) => onFilterChange("status", v)}>
                    <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체 상태</SelectItem>
                        {statusOptions.map(({ id, name }) => (
                            <SelectItem key={id} value={name}>
                                {name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Severity */}
                <Select value={filters.severity} onValueChange={(v) => onFilterChange("severity", v)}>
                    <SelectTrigger className="w-[190px]">
                        <SelectValue placeholder="위험도 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">전체 위험도</SelectItem>
                        {severityOptions.map(({ id, name, description }) => (
                            <SelectItem key={id} value={name}>
                                {description || name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                    <DatePicker
                        mode="single"
                        value={dateRange?.from}
                        onChange={(date) => onDateRangeChange({ from: date, to: dateRange?.to })}
                        placeholder="시작 날짜 선택"
                        className="w-[150px]"
                    />

                    ~

                    <DatePicker
                        mode="single"
                        value={dateRange?.to}
                        onChange={(date) => onDateRangeChange({ from: dateRange?.from, to: date })}
                        placeholder="종료 날짜 선택"
                        className="w-[150px]"
                     />
                </div>

                <Input
                    className="w-[220px]"
                    placeholder="검색어 입력"
                    value={filters.keyword}
                    onChange={(e) => onFilterChange("keyword", e.target.value)}
                />

                <Button onClick={onSearch}>검색</Button>
            </div>
        </div>
    );
}
