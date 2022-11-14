/**
 * @description User-provided static metadata input.
 */
export interface StaticMetadataConfigInput {
  /**
   * @description The version of the running service.
   */
  version: number;
  /**
   * @description The organization that owns this system.
   */
  owner: string;
  /**
   * @description The host platform or infrastructure that runs the system.
   */
  hostPlatform: string;
  /**
   * @description Domain of the producer system.
   */
  domain: string;
  /**
   * @description System of the producer.
   */
  system: string;
  /**
   * @description Service of the producer.
   */
  service: string;
  /**
   * @description Team responsible for emitting this log.
   */
  team: string;
  /**
   * @description Tags for the logged system.
   */
  tags?: string[];
  /**
   * @description Data sensitivity classification for the contents of this metric.
   * @example `public`, `proprietary`, `confidential`, `secret`
   */
  dataSensitivity?: string;
  /**
   * @description What legal jurisdiction does this system fall into?
   * @example `EU`, `US`, `CN`
   */
  jurisdiction?: string;
}

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
