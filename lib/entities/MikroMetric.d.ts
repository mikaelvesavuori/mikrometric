import { MetricLog, PropertyValue, Unit } from '../interfaces/interfaces';
export declare class MikroMetric {
    private static namespace;
    private static serviceName;
    private static metric;
    constructor(namespace?: string, serviceName?: string);
    private createBaseMetricObject;
    setNamespace(namespace: string): void;
    putDimension(key: string, value: string): void;
    putMetric(key: string, value: string | number, unit: Unit): void;
    setProperty(key: string, value: PropertyValue): void;
    flush(): MetricLog;
}
