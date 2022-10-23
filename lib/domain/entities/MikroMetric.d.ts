import { MetricLog } from '../interfaces/MetricLog';
import { MikroMetricInput } from '../interfaces/MikroMetricInput';
import { PropertyValue, Unit } from '../interfaces/Units';
export declare class MikroMetric {
    private static instance;
    private static namespace;
    private static serviceName;
    private static metric;
    private constructor();
    static start(input?: MikroMetricInput): MikroMetric;
    reset(): void;
    setNamespace(namespace: string): void;
    getNamespace(): string;
    getServiceName(): string;
    putDimension(key: string, value: string): void;
    putMetric(key: string, value: string | number, unit?: Unit): void;
    setProperty(key: string, value: PropertyValue): void;
    flush(): MetricLog;
    private hasNonAsciiCharacters;
    private canAddMoreItemsToArray;
    private isLengthWithinBounds;
    private createBaseMetricObject;
}
