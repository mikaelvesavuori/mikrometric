import { PropertyValue, Unit } from './Units';

export type MetricLog = {
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

export type AwsEmfMetadata = {
  Timestamp: number | Date;
  CloudWatchMetrics: CloudWatchMetric[];
};

export type CloudWatchMetric = {
  Namespace: string;
  Dimensions: string[][];
  Metrics: Metric[];
};

export type Metric = {
  Name: string;
  Unit: Unit;
};
