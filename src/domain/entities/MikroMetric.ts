import { randomUUID } from 'crypto';

import { getMetadata } from 'aws-metadata-utils';

import { DynamicMetadata, StaticMetadataConfigInput } from '../interfaces/Metadata';
import { MetricBaseObject, MetricObject } from '../interfaces/Metric';
import { MikroMetricInput } from '../interfaces/MikroMetricInput';
import { PropertyValue, Unit } from '../interfaces/Units';

import {
  CannotAddMoreItemsToArrayError,
  HasNonAsciiCharactersError,
  LengthNotWithinBoundsError,
  MissingRequiredStartParamsError
} from '../../application/errors/errors';

/**
 * @description MikroMetric is a Lambda-oriented lightweight wrapper
 * for producing AWS CloudWatch Embedded Metric Format-compatible metric logs.
 *
 * @example
 * ```
// ES5 format
const { MikroMetric } = require('mikrometric');
// ES6 format
import { MikroMetric } from 'mikrometric';

const mikroMetric = MikroMetric.start({ namespace: 'MyNamespace', serviceName: 'MyServiceName' });

mikroMetric.putDimension('User', 'Sam Person');
mikroMetric.putMetric('Duration', 83, 'Milliseconds');
mikroMetric.setProperty('CorrelationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');

mikroMetric.flush();
```
 */
export class MikroMetric {
  private static instance: MikroMetric;
  private static metadataConfig: StaticMetadataConfigInput | Record<string, any> = {};
  private static namespace: string;
  private static serviceName: string;
  private static event: any;
  private static context: any;
  private static correlationId: string;
  private static metric: MetricBaseObject;

  private constructor(namespace: string, serviceName: string, event?: any, context?: any) {
    MikroMetric.namespace = namespace;
    MikroMetric.serviceName = serviceName;
    MikroMetric.event = event || {};
    MikroMetric.context = context || {};
    MikroMetric.metadataConfig = {};
    MikroMetric.correlationId = '';
    MikroMetric.metric = this.createBaseMetricObject();
  }

  /**
   * @description This instantiates `MikroMetric`. In order to be able
   * to "remember" event and context we use a singleton pattern to
   * reuse the same logical instance.
   *
   * @example mikroMetric.start({ namespace: 'MyNamespace', serviceName: 'MyService' });
   */
  public static start(input?: MikroMetricInput): MikroMetric {
    const namespace = input?.namespace || process.env.MIKROMETRIC_NAMESPACE || '';
    const serviceName = input?.serviceName || process.env.MIKROMETRIC_SERVICE_NAME || '';
    if (!namespace || !serviceName) throw new MissingRequiredStartParamsError();

    const event = input?.event || this.event;
    const context = input?.context || this.context;
    const metadataConfig = input?.metadataConfig || this.metadataConfig;
    const correlationId = input?.correlationId || this.correlationId || '';

    if (!MikroMetric.instance)
      MikroMetric.instance = new MikroMetric(namespace, serviceName, event, context);

    MikroMetric.metadataConfig = metadataConfig;
    MikroMetric.namespace = namespace;
    MikroMetric.serviceName = serviceName;
    MikroMetric.event = event;
    MikroMetric.context = context;
    MikroMetric.correlationId = correlationId;

    return MikroMetric.instance;
  }

  /**
   * @description Reset to fresh state.
   *
   * @example mikroMetric.reset();
   */
  public reset(): void {
    MikroMetric.instance = new MikroMetric(MikroMetric.namespace, MikroMetric.serviceName);
  }

  /**
   * @description Set correlation ID manually, for example for use in cross-boundary calls.
   *
   * This value will be propagated to all future metrics.
   */
  public setCorrelationId(correlationId: string): void {
    MikroMetric.correlationId = correlationId;
  }

  /**
   * @description Set the namespace for the metric log.
   *
   * @example mikroMetric.setNamespace('MyNamespace');
   */
  public setNamespace(namespace: string): void {
    this.hasNonAsciiCharacters(namespace);
    this.isLengthWithinBounds(namespace, 255);

    MikroMetric.namespace = namespace;
  }

  /**
   * @description Get the current namespace.
   */
  public getNamespace(): string {
    return MikroMetric.namespace;
  }

  /**
   * @description Get the current service name.
   */
  public getServiceName(): string {
    return MikroMetric.serviceName;
  }

  /**
   * @description Put a dimension onto the metric log.
   *
   * From the AWS docs: "A `dimension` is a name/value pair that is part of the identity of a metric. You can assign up to 30 dimensions to a metric".
   *
   * @example mikroMetric.putDimension('User', 'Sam Person');
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Dimension
   */
  public putDimension(key: string, value: string): void {
    this.hasNonAsciiCharacters(key);
    this.hasNonAsciiCharacters(value);
    this.isLengthWithinBounds(key, 255);
    this.isLengthWithinBounds(value, 1024);
    this.canAddMoreItemsToArray(MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0], 30);

    this.setProperty(key, value);

    MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0].push(key);
  }

  /**
   * @description Put a metric onto the metric log.
   *
   * @example mikroMetric.putMetric('Duration', 83, 'Milliseconds');
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html#CloudWatch_Embedded_Metric_Format_Specification_structure_metricdefinition
   */
  public putMetric(key: string, value: string | number, unit?: Unit): void {
    this.hasNonAsciiCharacters(key);
    this.isLengthWithinBounds(key, 255);
    this.canAddMoreItemsToArray(MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics, 100);

    this.setProperty(key, value);

    MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics.push({
      Name: key,
      Unit: unit || 'None'
    });
  }

  /**
   * @description Set a property onto the metric log.
   *
   * These will be shown in CloudWatch Logs (Insights) but _not_ in CloudWatch Metrics.
   *
   * @example mikroMetric.setProperty('RequestId', '422b1569-16f6-4a03-b8f0-fe3fd9b100f8');
   */
  public setProperty(key: string, value: PropertyValue): void {
    this.hasNonAsciiCharacters(key);
    this.isLengthWithinBounds(key, 255);

    MikroMetric.metric[key] = value;
  }

  /**
   * @description "Flush" your metric log, which in plain English means "send it".
   * The log will be picked up by CloudWatch Metrics automatically through the log format.
   *
   * @example mikroMetric.flush();
   */
  public flush(): MetricObject {
    const metric = this.createMetricObject();
    process.stdout.write(JSON.stringify(metric) + '\n');
    this.reset();
    return metric;
  }

  /**
   * @description Create the base AWS EMF object shape.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html
   * @see https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
   */
  private createBaseMetricObject(): MetricBaseObject {
    return {
      service: MikroMetric.serviceName,
      _aws: {
        Timestamp: Date.now(),
        CloudWatchMetrics: [
          {
            Namespace: MikroMetric.namespace,
            Dimensions: [['service']],
            Metrics: []
          }
        ]
      }
    };
  }

  /**
   * @description Create the metric object.
   */
  private createMetricObject(): MetricObject {
    const completeMetric = this.sortOutput({
      ...this.createDynamicMetadata(),
      ...MikroMetric.metadataConfig,
      ...MikroMetric.metric
    });

    const filtered = this.filterMetadata(completeMetric);

    return JSON.parse(JSON.stringify(filtered));
  }

  /**
   * @description Get dynamic metadata with `aws-metadata-utils` and
   * add some extra bits on top.
   */
  private createDynamicMetadata(): DynamicMetadata {
    const metadata = getMetadata(MikroMetric.event, MikroMetric.context);
    const timeNow = Date.now();

    return {
      ...metadata,
      correlationId: MikroMetric.correlationId || metadata.correlationId,
      id: randomUUID(),
      timestamp: new Date(timeNow).toISOString(),
      timestampEpoch: `${timeNow}`
    };
  }

  /**
   * @description Check if a string contains any non-ASCII characters.
   */
  private hasNonAsciiCharacters(stringToTest: string): void {
    if ([...stringToTest].some((character) => character.charCodeAt(0) > 127))
      throw new HasNonAsciiCharactersError();
  }

  /**
   * @description Validate if the length of an array is within acceptable bounds.
   */
  private canAddMoreItemsToArray(array: any[], maximumLength: number): void {
    if (array.length > maximumLength) throw new CannotAddMoreItemsToArrayError(maximumLength);
  }

  /**
   * @description Validate if the length of a string is within acceptable bounds.
   */
  private isLengthWithinBounds(value: string, maximumLength: number): void {
    if (value.length === 0 || value.length > maximumLength)
      throw new LengthNotWithinBoundsError(maximumLength);
  }

  /**
   * @description Filter metadata from empties.
   */
  private filterMetadata(metadata: Record<string, any>) {
    const filteredMetadata: any = {};

    Object.entries(metadata).forEach((entry: any) => {
      const [key, value] = entry;
      if (value) filteredMetadata[key] = value;
    });

    return filteredMetadata;
  }

  /**
   * @description Alphabetically sort the fields in the log object.
   */
  private sortOutput(input: Record<string, any>) {
    const sortedOutput: any = {};

    Object.entries(input)
      .sort()
      .forEach(([key, value]) => (sortedOutput[key] = value));

    return sortedOutput;
  }
}
