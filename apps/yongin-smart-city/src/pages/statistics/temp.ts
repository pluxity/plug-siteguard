import statisticsPageData from '../../../public/sample/base.json';

export const useSite = () => {
    return {
        data: statisticsPageData.site.data,
    };
}

export const useProgress = () => {
    return {
        data: statisticsPageData.progress.data,
    };
}

export const useSeverity = () => {
    return {
        data: statisticsPageData.severity.data,
    };
}

export const useStatus = () => {
    return {
        data: statisticsPageData.status.data,
    };
}

