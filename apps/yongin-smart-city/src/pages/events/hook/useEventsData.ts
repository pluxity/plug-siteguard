import { useState, useCallback } from "react";
import { getEventsData, EventsRequest, EventsResponse } from "@/services";

export function useEventsData() {
    const [response, setResponse] = useState<EventsResponse>();

    const fetchEvents = useCallback(async (params: EventsRequest) => {

            const response = await getEventsData(params);
            setResponse(response);

    }, []);

    const events = response?.data?.content ?? [];
    const totalPages = response?.data?.totalPages ?? 1;

    return { events, totalPages, fetchEvents };
}