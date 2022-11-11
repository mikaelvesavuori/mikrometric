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
 * @description Dynamic metadata from AWS environment and context.
 */
export type DynamicMetadata = {
  /**
   * @description The AWS account ID that the system is running in.
   */
  accountId: string;
  /**
   * @description Correlation ID for this function call.
   */
  correlationId: string;
  /**
   * @description Memory size of the function emitting this metric.
   */
  functionMemorySize: string;
  /**
   * @description Name of the function emitting this metric.
   */
  functionName: string;
  /**
   * @description Version of the function emitting this metric.
   */
  functionVersion: string;
  /**
   * @description ID of the metric.
   */
  id: string;
  /**
   * @description Region of the system emitting this metric.
   */
  region: string;
  /**
   * @description The resource (channel, URL path...) that is responding.
   */
  resource: string;
  /**
   * @description Runtime of the system emitting this metric.
   */
  runtime: string;
  /**
   * @description What AWS stage are we in?
   */
  stage: string;
  /**
   * @description Timestamp of this message in ISO 8601 (RFC 3339) format.
   */
  timestamp: string;
  /**
   * @description Timestamp of this message in Unix epoch.
   */
  timestampEpoch: string;
  /**
   * @description The user in this metric context.
   */
  user: string;
  /**
   * @description Which country did AWS CloudFront infer the user to be in?
   */
  viewerCountry: string;
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
