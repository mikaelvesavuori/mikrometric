import { DynamicMetadata } from './Metadata';
import { PropertyValue, Unit } from './Units';

/**
 * @description Base metric object.
 */
export type MetricBaseObject = {
  /**
   * @description Any custom key-value pairs.
   */
  [key: string]: PropertyValue | AwsEmfMetadata;
  /**
   * @description Name of the system emitting this metric.
   */
  service: string;
  /**
   * @description AWS EMF metadata.
   */
  _aws: AwsEmfMetadata;
};

/**
 * @description The final metric object.
 */
export type MetricObject = MetricBaseObject & DynamicMetadata;

/**
 * @description AWS EMF metadata.
 */
export type AwsEmfMetadata = {
  Timestamp: number | Date;
  CloudWatchMetrics: CloudWatchMetric[];
};

/**
 * @description CloudWatch metric shape.
 */
export type CloudWatchMetric = {
  Namespace: string;
  Dimensions: string[][];
  Metrics: Metric[];
};

/**
 * @description A single metric.
 */
export type Metric = {
  Name: string;
  Unit: Unit;
};
