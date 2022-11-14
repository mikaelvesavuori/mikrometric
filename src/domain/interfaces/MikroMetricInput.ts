export type MikroMetricInput = {
  /**
   * @description The AWS CloudWatch namespace.
   */
  namespace?: string;
  /**
   * @description The service's name.
   */
  serviceName?: string;
  /**
   * @description AWS `event` object.
   */
  event?: any;
  /**
   * @description AWS `context` object.
   */
  context?: any;
  /**
   * Manually set correlation ID.
   */
  correlationId?: string;
};
