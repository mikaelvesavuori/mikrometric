import { PropertyValue, Unit } from './Units';
export declare type MetricLog = {
    [key: string]: PropertyValue | AwsEmfMetadata;
    Service: string;
    Region: string;
    Runtime: string;
    FunctionName: string;
    FunctionMemorySize: string;
    FunctionVersion: string;
    LogGroupName: string;
    LogStreamName: string;
    _aws: AwsEmfMetadata;
};
export declare type AwsEmfMetadata = {
    Timestamp: number | Date;
    CloudWatchMetrics: CloudWatchMetric[];
};
export declare type CloudWatchMetric = {
    Namespace: string;
    Dimensions: string[][];
    Metrics: Metric[];
};
export declare type Metric = {
    Name: string;
    Unit: Unit;
};
