import { PropertyValue, Unit } from './Units';

export type MetricLog = {
  [key: string]: PropertyValue | AwsEmfMetadata;
  /**
   * @description Name of the system emitting this metric.
   */
  service: string;
  /**
   * @description Region of the system emitting this metric.
   */
  region: string;
  /**
   * @description Runtime of the system emitting this metric.
   */
  runtime: string;
  /**
   * @description Name of the function emitting this metric.
   */
  functionName: string;
  /**
   * @description Memory size of the function emitting this metric.
   */
  functionMemorySize: string;
  /**
   * @description Version of the function emitting this metric.
   */
  functionVersion: string;
  /**
   * @description Name of the log group where this will be stored.
   */
  logGroupName: string;
  /**
   * @description Name of the log stream where this will be stored.
   */
  logStreamName: string;
  /**
   * @description AWS EMF metadata.
   */
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
