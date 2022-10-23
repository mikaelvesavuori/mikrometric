"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroMetric = void 0;
class MikroMetric {
    constructor(namespace, serviceName) {
        MikroMetric.metric = this.createBaseMetricObject();
        MikroMetric.namespace = namespace || process.env.MIKROMETRIC_NAMESPACE || '';
        MikroMetric.serviceName = serviceName || process.env.MIKROMETRIC_SERVICE_NAME || '';
        if (!MikroMetric.namespace || !MikroMetric.serviceName)
            throw new Error('Missing namespace and/or service name while initializing MikroMetric!');
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
    setNamespace(namespace) {
        MikroMetric.namespace = namespace;
    }
    putDimension(key, value) {
        this.setProperty(key, value);
        if (MikroMetric.metric)
            MikroMetric.metric._aws.CloudWatchMetrics[0].Dimensions[0].push(key);
    }
    putMetric(key, value, unit) {
        this.setProperty(key, value);
        if (MikroMetric.metric)
            MikroMetric.metric._aws.CloudWatchMetrics[0].Metrics.push({
                Name: key,
                Unit: unit
            });
    }
    setProperty(key, value) {
        if (MikroMetric.metric)
            MikroMetric.metric[key] = value;
    }
    flush() {
        const metric = JSON.parse(JSON.stringify(MikroMetric.metric));
        console.log(JSON.stringify(metric));
        MikroMetric.metric = null;
        return metric;
    }
}
exports.MikroMetric = MikroMetric;
//# sourceMappingURL=MikroMetric.js.map