import { useState, useCallback } from "react";
import { getEventsData, EventsRequest, EventsResponse } from "@/services";

export function useEventsData() {
    const [response, setResponse] = useState<EventsResponse>();

    const fetchEvents = useCallback(async (params: EventsRequest) => {
        try {
            const response = await getEventsData(params);
            setResponse(response);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        }
    }, []);

    const events = response?.data?.content ?? [];
    const totalPages = response?.data?.totalPages ?? 1;

    return { events, totalPages, fetchEvents };
}