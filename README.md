# mikrometric

**MikroMetric is a Lambda-oriented lightweight wrapper for producing AWS CloudWatch Embedded Metric Format-compatible metric logs**.

![Build Status](https://github.com/mikaelvesavuori/mikrometric/workflows/main/badge.svg)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmikaelvesavuori%2Fmikrometric.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmikaelvesavuori%2Fmikrometric?ref=badge_shield)

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
- Uses `process.stdout.write()` rather than `console.log()` so you can safely use it in Lambda
- Tiny (~2 KB gzipped)
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

mikroMetric.putDimension('User', 'Sam Person');
mikroMetric.putMetric('Duration', 83, 'Milliseconds');
mikroMetric.setProperty('CorrelationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');

mikroMetric.flush();
```

The `namespace` and `serviceName` may be passed in either manually at init-time (as above), or be inferred via environment variables (see below). When initializing, some representation of these values **must** exist or an error will be thrown.

### Creating metric logs

#### Put a dimension

```typescript
mikroMetric.putDimension('User', 'Sam Person');
```

#### Put a metric

```typescript
mikroMetric.putMetric('Duration', 83, 'Milliseconds');
```

#### Set a property

```typescript
mikroMetric.setProperty('CorrelationId', '8d5a0ba6-05e0-4c9b-bc7c-9164ea1bdedd');
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

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmikaelvesavuori%2Fmikrometric.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmikaelvesavuori%2Fmikrometric?ref=badge_large)
