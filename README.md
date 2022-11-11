# mikrometric

**MikroMetric is a Lambda-oriented lightweight wrapper for producing AWS CloudWatch Embedded Metric Format-compatible metric logs**.

![Build Status](https://github.com/mikaelvesavuori/mikrometric/workflows/main/badge.svg)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mikaelvesavuori_mikrometric&metric=alert_status)](https://sonarcloud.io/dashboard?id=mikaelvesavuori_mikrometric)

[![codecov](https://codecov.io/gh/mikaelvesavuori/mikrometric/branch/main/graph/badge.svg?token=S7D3RM9TO7)](https://codecov.io/gh/mikaelvesavuori/mikrometric)

[![Maintainability](https://api.codeclimate.com/v1/badges/d960f299a99a79f781d3/maintainability)](https://codeclimate.com/github/mikaelvesavuori/mikrometric/maintainability)

---

MikroMetric is the quickest way to get going with AWS metrics (CloudWatch Embedded Metric Format):

- Adapted out-of-the box for serverless Lambda environments
- Zero config besides setting a namespace and service name
- Familiar syntax using methods like `putDimension()`, `putMetric()`, `setProperty()`, and `flush()`
- Easier to understand than raw EMF and less chance of breaking it (or your computer, trying to get it right!)
- Less bloated than the other major libraries
- Cuts out all the stuff you won't need in cloud/serverless
- Tiny (~1.6 KB gzipped)
- Has zero dependencies
- Has 100% test coverage

## Usage

### Basic importing and usage

```typescript
// ES5 format
const { MikroMetric } = require('mikrometric');
// ES6 format
import { MikroMetric } from 'mikrometric';

const mikroMetric = MikroMetric.start({ namespace: 'MyNamespace', serviceName: 'MyServiceName' });

mikroMetric.putDimension('user', 'Sam Person');
mikroMetric.putMetric('duration', 83, 'Milliseconds');
mikroMetric.setProperty('correlationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');

mikroMetric.flush();
```

Your metric log will look something like this in CloudWatch Logs:

```json
{
  "service": "MyServiceName",
  "region": "eu-north-1",
  "runtime": "AWS_Lambda_nodejs16.x",
  "functionName": "aws-emf-demo-dev-CreateExampleMetrics",
  "functionMemorySize": "512",
  "functionVersion": "$LATEST",
  "logGroupName": "/aws/lambda/aws-emf-demo-dev-CreateExampleMetrics",
  "logStreamName": "2022/10/23/[$LATEST]e731d9b847d04b54bb4e67ef248a3fd0",
  "_aws": {
    "Timestamp": 1666550869329,
    "CloudWatchMetrics": [
      {
        "Namespace": "MyNamespace",
        "Dimensions": [["Service", "User"]],
        "Metrics": [
          {
            "Name": "Duration",
            "Unit": "Milliseconds"
          }
        ]
      }
    ]
  },
  "user": "Sam Person",
  "duration": 83,
  "correlationId": "8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd"
}
```

The `namespace` and `serviceName` may be passed in either manually at init-time (as above), or be inferred via environment variables (see below). When initializing, some representation of these values **must** exist or an error will be thrown.

You can now use [CloudWatch Logs Insights](https://console.aws.amazon.com/cloudwatch/home?#logsV2:logs-insights) and [CloudWatch Metrics](<https://console.aws.amazon.com/cloudwatch/home?#metricsV2:graph=~()>) to either search your logs or visualize your metrics.

**For more learning resources regarding AWS observability solutions, see the [One Observability Workshop](https://catalog.workshops.aws/observability/en-US), especially the page on [EMF](https://catalog.workshops.aws/observability/en-US/emf/clientlibrary)**.

### Creating metric logs

#### Put a dimension

```typescript
mikroMetric.putDimension('user', 'Sam Person');
```

#### Put a metric

```typescript
mikroMetric.putMetric('duration', 83, 'Milliseconds');
```

#### Set a property

```typescript
mikroMetric.setProperty('correlationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');
```

#### Flush

"Flushing", or _sending_, logs is easy:

```typescript
mikroMetric.flush();
```

Because this is assumed to be within an AWS Lambda context, then flushing is simply a case of logging out the metric data.

Flushing will reset the MikroMetric instance. See `Reset` below.

### Other features

#### Set the namespace manually

```typescript
mikroMetric.setNamespace('MyNewNamespace');
```

#### Get namespace

```typescript
mikroMetric.getNamespace();
```

#### Get service name

```typescript
mikroMetric.getServiceName();
```

#### Reset

This resets the metric log context and therefore erases any dimensions, metrics, and properties.

```typescript
mikroMetric.reset();
```

## Configuration

### Setting the namespace and/or service name with environment variables

You can set `MIKROMETRIC_NAMESPACE` and/or `MIKROMETRIC_SERVICE_NAME` respectively as environment variables to use these at init time.

**Any values manually passed in will always take precedence**.

## License

MIT. See `LICENSE` file.
