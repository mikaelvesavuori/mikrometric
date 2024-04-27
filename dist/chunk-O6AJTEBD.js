import {
  CannotAddMoreItemsToArrayError,
  HasNonAsciiCharactersError,
  LengthNotWithinBoundsError,
  MissingRequiredStartParamsError
} from "./chunk-B3MNYXDR.js";

// src/domain/entities/MikroMetric.ts
import { randomUUID } from "crypto";
import { getMetadata } from "aws-metadata-utils";
var MikroMetric = class _MikroMetric {
  static instance;
  static metadataConfig = {};
  static namespace;
  static serviceName;
  static event;
  static context;
  static correlationId;
  static metric;
  constructor(namespace, serviceName, event, context) {
    _MikroMetric.namespace = namespace;
    _MikroMetric.serviceName = serviceName;
    _MikroMetric.event = event || {};
    _MikroMetric.context = context || {};
    _MikroMetric.metadataConfig = {};
    _MikroMetric.correlationId = "";
    _MikroMetric.metric = this.createBaseMetricObject();
  }
  /**
   * @description This instantiates `MikroMetric`. In order to be able
   * to "remember" event and context we use a singleton pattern to
   * reuse the same logical instance.
   *
   * @example mikroMetric.start({ namespace: 'MyNamespace', serviceName: 'MyService' });
   */
  static start(input) {
    const namespace = input?.namespace || process.env.MIKROMETRIC_NAMESPACE || "";
    const serviceName = input?.serviceName || process.env.MIKROMETRIC_SERVICE_NAME || "";
    if (!namespace || !serviceName)
      throw new MissingRequiredStartParamsError();
    const event = input?.event || this.event;
    const context = input?.context || this.context;
    const metadataConfig = input?.metadataConfig || this.metadataConfig;
    const correlationId = input?.correlationId || this.correlationId || "";
    if (!_MikroMetric.instance)
      _MikroMetric.instance = new _MikroMetric(namespace, serviceName, event, context);
    _MikroMetric.metadataConfig = metadataConfig;
    _MikroMetric.namespace = namespace;
    _MikroMetric.serviceName = serviceName;
    _MikroMetric.event = event;
    _MikroMetric.context = context;
    _MikroMetric.correlationId = correlationId;
    return _MikroMetric.instance;
  }
  /**
   * @description Reset to fresh state.
   *
   * @example mikroMetric.reset();
   */
  reset() {
    _MikroMetric.instance = new _MikroMetric(_MikroMetric.namespace, _MikroMetric.serviceName);
  }
  /**
   * @description Set correlation ID manually, for example for use in cross-boundary calls.
   *
   * This value will be propagated to all future metrics.
   */
  setCorrelationId(correlationId) {
    _MikroMetric.correlationId = correlationId;
  }
  /**
   * @description Set the namespace for the metric log.
   *
   * @example mikroMetric.setNamespace('MyNamespace');
   */
  setNamespace(namespace) {
    this.hasNonAsciiCharacters(namespace);
    this.isLengthWithinBounds(namespace, 255);
    _MikroMetric.namespace = namespace;
  }
  /**
   * @description Get the current namespace.
   */
  getNamespace() {
    return _MikroMetric.namespace;
  }
  /**
   * @description Get the current service name.
   */
  getServiceName() {
    return _MikroMetric.serviceName;
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
  putDimension(key, value) {
    this.hasNonAsciiCharacters(key);
    this.hasNonAsciiCharacters(value);
    this.isLengthWithinBounds(key, 255);
    this.isLengthWithinBounds(value, 1024);
    this.canAddMoreItemsToArray(_MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0], 30);
    this.setProperty(key, value);
    _MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0].push(key);
  }
  /**
   * @description Put a metric onto the metric log.
   *
   * @example mikroMetric.putMetric('Duration', 83, 'Milliseconds');
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html#CloudWatch_Embedded_Metric_Format_Specification_structure_metricdefinition
   */
  putMetric(key, value, unit) {
    this.hasNonAsciiCharacters(key);
    this.isLengthWithinBounds(key, 255);
    this.canAddMoreItemsToArray(_MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics, 100);
    this.setProperty(key, value);
    _MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics.push({
      Name: key,
      Unit: unit || "None"
    });
  }
  /**
   * @description Set a property onto the metric log.
   *
   * These will be shown in CloudWatch Logs (Insights) but _not_ in CloudWatch Metrics.
   *
   * @example mikroMetric.setProperty('RequestId', '422b1569-16f6-4a03-b8f0-fe3fd9b100f8');
   */
  setProperty(key, value) {
    this.hasNonAsciiCharacters(key);
    this.isLengthWithinBounds(key, 255);
    _MikroMetric.metric[key] = value;
  }
  /**
   * @description "Flush" your metric log, which in plain English means "send it".
   * The log will be picked up by CloudWatch Metrics automatically through the log format.
   *
   * @example mikroMetric.flush();
   */
  flush() {
    const metric = this.createMetricObject();
    process.stdout.write(JSON.stringify(metric) + "\n");
    this.reset();
    return metric;
  }
  /**
   * @description Create the base AWS EMF object shape.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format_Specification.html
   * @see https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html
   */
  createBaseMetricObject() {
    return {
      service: _MikroMetric.serviceName,
      _aws: {
        Timestamp: Date.now(),
        CloudWatchMetrics: [
          {
            Namespace: _MikroMetric.namespace,
            Dimensions: [["service"]],
            Metrics: []
          }
        ]
      }
    };
  }
  /**
   * @description Create the metric object.
   */
  createMetricObject() {
    const completeMetric = this.sortOutput({
      ...this.createDynamicMetadata(),
      ..._MikroMetric.metadataConfig,
      ..._MikroMetric.metric
    });
    const filtered = this.filterMetadata(completeMetric);
    return JSON.parse(JSON.stringify(filtered));
  }
  /**
   * @description Get dynamic metadata with `aws-metadata-utils` and
   * add some extra bits on top.
   */
  createDynamicMetadata() {
    const metadata = getMetadata(_MikroMetric.event, _MikroMetric.context);
    const timeNow = Date.now();
    return {
      ...metadata,
      correlationId: _MikroMetric.correlationId || metadata.correlationId,
      id: randomUUID(),
      timestamp: new Date(timeNow).toISOString(),
      timestampEpoch: `${timeNow}`
    };
  }
  /**
   * @description Check if a string contains any non-ASCII characters.
   */
  hasNonAsciiCharacters(stringToTest) {
    if ([...stringToTest].some((character) => character.charCodeAt(0) > 127))
      throw new HasNonAsciiCharactersError();
  }
  /**
   * @description Validate if the length of an array is within acceptable bounds.
   */
  canAddMoreItemsToArray(array, maximumLength) {
    if (array.length > maximumLength)
      throw new CannotAddMoreItemsToArrayError(maximumLength);
  }
  /**
   * @description Validate if the length of a string is within acceptable bounds.
   */
  isLengthWithinBounds(value, maximumLength) {
    if (value.length === 0 || value.length > maximumLength)
      throw new LengthNotWithinBoundsError(maximumLength);
  }
  /**
   * @description Filter metadata from empties.
   */
  filterMetadata(metadata) {
    const filteredMetadata = {};
    Object.entries(metadata).forEach((entry) => {
      const [key, value] = entry;
      if (value || value === 0)
        filteredMetadata[key] = value;
    });
    return filteredMetadata;
  }
  /**
   * @description Alphabetically sort the fields in the log object.
   */
  sortOutput(input) {
    const sortedOutput = {};
    Object.entries(input).sort().forEach(([key, value]) => sortedOutput[key] = value);
    return sortedOutput;
  }
};

export {
  MikroMetric
};
