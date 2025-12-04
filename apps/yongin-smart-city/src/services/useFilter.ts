import { useMemo } from "react";
import { DateRange } from "react-day-picker";

export const useFilter =
  <TFilters extends Record<string, unknown>,
    TRequest extends Record<string, unknown>>(
      filters: TFilters,
      dateRange: DateRange | undefined,
      currentPage: number,
    ) => {

    const params = useMemo(() => {
      const request: Record<string, unknown> = {
        page: currentPage,
        size: 10,
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "ALL") {
          request[key] = value;
        }
      });

      if (dateRange?.from) request.from = dateRange.from.toISOString();
      if (dateRange?.to) request.to = dateRange.to.toISOString();

      return request as TRequest;
    }, [filters, dateRange, currentPage]);

    return { params };
  };