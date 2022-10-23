"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroMetric = void 0;
const errors_1 = require("../../application/errors/errors");
class MikroMetric {
    constructor() {
        MikroMetric.namespace = '';
        MikroMetric.serviceName = '';
        MikroMetric.metric = this.createBaseMetricObject();
    }
    static start(input) {
        if (!MikroMetric.instance)
            MikroMetric.instance = new MikroMetric();
        MikroMetric.namespace = input?.namespace || process.env.MIKROMETRIC_NAMESPACE || '';
        MikroMetric.serviceName = input?.serviceName || process.env.MIKROMETRIC_SERVICE_NAME || '';
        if (!MikroMetric.namespace || !MikroMetric.serviceName)
            throw new errors_1.MissingRequiredStartParamsError();
        return MikroMetric.instance;
    }
    reset() {
        MikroMetric.instance = new MikroMetric();
    }
    setNamespace(namespace) {
        this.hasNonAsciiCharacters(namespace);
        this.isLengthWithinBounds(namespace, 255);
        MikroMetric.namespace = namespace;
    }
    getNamespace() {
        return MikroMetric.namespace;
    }
    getServiceName() {
        return MikroMetric.serviceName;
    }
    putDimension(key, value) {
        this.hasNonAsciiCharacters(key);
        this.hasNonAsciiCharacters(value);
        this.isLengthWithinBounds(key, 255);
        this.isLengthWithinBounds(value, 1024);
        this.canAddMoreItemsToArray(MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0], 30);
        this.setProperty(key, value);
        MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0].push(key);
    }
    putMetric(key, value, unit) {
        this.hasNonAsciiCharacters(key);
        this.isLengthWithinBounds(key, 255);
        this.canAddMoreItemsToArray(MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics, 100);
        this.setProperty(key, value);
        MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics.push({
            Name: key,
            Unit: unit || 'None'
        });
    }
    setProperty(key, value) {
        this.hasNonAsciiCharacters(key);
        this.isLengthWithinBounds(key, 255);
        MikroMetric.metric[key] = value;
    }
    flush() {
        const metric = JSON.parse(JSON.stringify(MikroMetric.metric));
        console.log(JSON.stringify(metric));
        this.reset();
        return metric;
    }
    hasNonAsciiCharacters(stringToTest) {
        if ([...stringToTest].some((character) => character.charCodeAt(0) > 127))
            throw new errors_1.HasNonAsciiCharactersError();
    }
    canAddMoreItemsToArray(array, maximumLength) {
        if (array.length > maximumLength)
            throw new errors_1.CannotAddMoreItemsToArrayError(maximumLength);
    }
    isLengthWithinBounds(value, maximumLength) {
        if (value.length === 0 || value.length > maximumLength)
            throw new errors_1.LengthNotWithinBoundsError(maximumLength);
    }
    createBaseMetricObject() {
        return {
            Service: MikroMetric.serviceName,
            Region: process.env.AWS_REGION || '',
            Runtime: process.env.AWS_EXECUTION_ENV || '',
            FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || '',
            FunctionMemorySize: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE || '',
            FunctionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION || '',
            LogGroupName: process.env.AWS_LAMBDA_LOG_GROUP_NAME || '',
            LogStreamName: process.env.AWS_LAMBDA_LOG_STREAM_NAME || '',
            _aws: {
                Timestamp: Date.now(),
                CloudWatchMetrics: [
                    {
                        Namespace: MikroMetric.namespace,
                        Dimensions: [['Service']],
                        Metrics: []
                    }
                ]
            }
        };
    }
}
exports.MikroMetric = MikroMetric;
//# sourceMappingURL=MikroMetric.js.map