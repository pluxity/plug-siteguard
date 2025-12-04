// TODO:: 삭제 예정
import statisticsPageData from '../../../public/sample/statistics/base.json';

export const useStatistics = () => {
    return {
        data: statisticsPageData.statistics.data,
    };
}

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

