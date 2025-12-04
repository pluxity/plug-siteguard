export interface ClusterOptions {
    enabled?: boolean;
    pixelRange?: number;
    minimumClusterSize?: number;
    clusterBillboards?: boolean;
}

export interface ClusterStyleOptions {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    size?: number;
    imageUrl?: string;
}

export interface ZoomThreshold {
    height: number; 
    pixelRange: number;
}

export const DEFAULT_ZOOM_THRESHOLDS: ZoomThreshold[] = [
    { height: 1000, pixelRange: 1 },        
    { height: Infinity, pixelRange: 20 }, 
]