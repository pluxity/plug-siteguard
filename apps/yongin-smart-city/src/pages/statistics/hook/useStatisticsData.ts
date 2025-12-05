import { useState, useCallback } from "react";
import { getStatisticsData, StatisticsRequest, StatisticsResponse } from "@/services";

export function useStatisticsData() {
    const [response, setResponse] = useState<StatisticsResponse>();

    const fetchStatistics = useCallback(async (params: StatisticsRequest) => {
        try {
            const response = await getStatisticsData(params);
            setResponse(response);
        } catch (err) {
            console.error("Failed to fetch statistics:", err);
        }
    }, []);

    const statistics = response?.data?.content ?? [];
    const totalPages = response?.data?.totalPages ?? 1;

    return { statistics, totalPages, fetchStatistics };
}