import { CustomDataSource, Event } from 'cesium';
import { ClusterOptions, ClusterStyleOptions, ZoomThreshold } from './types';
import { Viewer as CesiumViewer } from 'cesium';

export const setCluster = (
    dataSource: CustomDataSource,
    options?: ClusterOptions,
): void => {
    dataSource.clustering.enabled = options?.enabled ?? true;
    dataSource.clustering.pixelRange = options?.pixelRange ?? 80;
    dataSource.clustering.minimumClusterSize = options?.minimumClusterSize ?? 2;
    dataSource.clustering.clusterBillboards = options?.clusterBillboards ?? true;
}

export const createClusterStyle = (
    count: number,
    styleOptions?: ClusterStyleOptions,
): string => {
   const size = styleOptions?.size ?? 56;
   const bgColor = styleOptions?.backgroundColor ?? '#3B82F6';    
   const borderColor = styleOptions?.borderColor ?? '#1D4ED8';   
   const textColor = styleOptions?.textColor ?? '#FFFFFF';        
   const displayCount = count > 999 ? '999+' : count.toString();
   const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle 
            cx="${size / 2}" 
            cy="${size / 2}" 
            r="${size / 2 - 2}" 
            fill="${bgColor}" 
            stroke="${borderColor}" 
            stroke-width="2"
        />
        <text 
            x="50%" 
            y="50%" 
            dominant-baseline="central" 
            text-anchor="middle" 
            fill="${textColor}" 
            font-family="Pretendard, sans-serif" 
            font-weight="bold" 
            font-size="${size / 3}px"
        >
            ${displayCount}
        </text>
    </svg>
`;

return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const applyClusterCallback = (
    dataSource: CustomDataSource,
    styleOptions?: ClusterStyleOptions,
): Event.RemoveCallback => {
    const size = styleOptions?.size ?? 60;
    
    return dataSource.clustering.clusterEvent.addEventListener(
        (clusteredEntities, cluster) => {
            const count = clusteredEntities.length;
            
            cluster.billboard.show = true;
            cluster.billboard.image = createClusterStyle(count, styleOptions);
            cluster.billboard.width = size;
            cluster.billboard.height = size;
            cluster.billboard.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            cluster.label.show = false; 
            cluster.point.show = false;  
        }
    );
};

export const applyZoomCluster = (
    viewer: CesiumViewer,
    dataSource: CustomDataSource,
    zoomThreshold: ZoomThreshold[],
): Event.RemoveCallback => {
    const updatePixelRange = () => {
        const height = viewer.camera.positionCartographic.height;
        if (height < 1500) {
            dataSource.clustering.enabled = false;
        } else {
            dataSource.clustering.enabled = true;
            const threshold = zoomThreshold.find(t => height <= t.height);
            if (threshold) {
                dataSource.clustering.pixelRange = threshold.pixelRange;
            }
        }
    }
    updatePixelRange();
    return viewer.camera.changed.addEventListener(updatePixelRange);
};

export const cleanUpCluster = (
    dataSource: CustomDataSource,
    clusterRemover?: Event.RemoveCallback,
    zoomRemover?: Event.RemoveCallback,
): void => {
    clusterRemover?.();
    zoomRemover?.();
    dataSource.clustering.enabled = false;
};
