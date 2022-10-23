import test from 'ava';

import { MikroMetric } from '../src/domain/entities/MikroMetric';

const config = { namespace: 'MyNamespace', serviceName: 'MyService' };

/**
 * POSITIVE TESTS
 */
test.serial('It should set the instance to a new one', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  const isInstance = mikroMetric instanceof MikroMetric;

  t.is(isInstance, expected);
});

test.serial('It should capture the namespace from the process environment', (t) => {
  const expected = 'MyNamespace';
  process.env.MIKROMETRIC_NAMESPACE = expected;

  const mikroMetric = MikroMetric.start({ serviceName: 'MyService' });

  const result = mikroMetric.getNamespace();
  t.is(result, expected);
  process.env.MIKROMETRIC_NAMESPACE = '';
});

test.serial('It should capture the service name from the process environment', (t) => {
  const expected = 'MyService';
  process.env.MIKROMETRIC_SERVICE_NAME = expected;

  const mikroMetric = MikroMetric.start({ namespace: 'MyNamespace' });

  const result = mikroMetric.getServiceName();
  t.is(result, expected);
  process.env.MIKROMETRIC_SERVICE_NAME = '';
});

test.serial('It should reset to a new instance', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putMetric('Duration', 83, 'Milliseconds');
  mikroMetric.reset();
  const log = mikroMetric.flush();

  const result = log._aws.CloudWatchMetrics[0].Metrics[0] === undefined;
  t.is(result, expected);
});

test.serial('It should set the namespace', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = 'MyNewNamespace';

  mikroMetric.setNamespace(expected);

  const result = mikroMetric.getNamespace();
  t.is(result, expected);
});

test.serial('It should put a dimension', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putDimension('User', 'Sam Person');
  const log = mikroMetric.flush();
  const dimensions = log._aws.CloudWatchMetrics[0].Dimensions[0];

  const result = dimensions.includes('User');
  t.is(result, expected);
});

test.serial('It should put a metric', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putMetric('Duration', 83, 'Milliseconds');
  const log = mikroMetric.flush();
  const metric = log._aws.CloudWatchMetrics[0].Metrics[0];

  const result = metric['Name'] === 'Duration';
  t.is(result, expected);
});

test.serial('It should put a metric without a unit provided', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putMetric('Duration', 83);
  const log = mikroMetric.flush();
  const metric = log._aws.CloudWatchMetrics[0].Metrics[0];

  const result = metric['Unit'] === 'None';
  t.is(result, expected);
});

test.serial('It should set a property', (t) => {
  const mikroMetric = MikroMetric.start(config);
  const expected = 'Something';
  const key = 'MyProperty';

  mikroMetric.setProperty(key, expected);
  const result = mikroMetric.flush();

  t.is(result[key], expected);
});

/**
 * FAILURE TESTS
 */
test.serial(
  'Starting without neither namespace or service name will throw a MissingRequiredStartParamsError',
  (t) => {
    const error: any = t.throws(() => MikroMetric.start());

    t.is(error.name, 'MissingRequiredStartParamsError');
  }
);

test.serial('Starting without a service name will throw a MissingRequiredStartParamsError', (t) => {
  const error: any = t.throws(() => MikroMetric.start({ namespace: 'MyNamespace' }));

  t.is(error.name, 'MissingRequiredStartParamsError');
});

test.serial('Starting without a namespace will throw a MissingRequiredStartParamsError', (t) => {
  const error: any = t.throws(() => MikroMetric.start({ serviceName: 'MyService' }));

  t.is(error.name, 'MissingRequiredStartParamsError');
});

test.serial(
  'It should throw a HasNonAsciiCharactersError if a string key contains non-ASCII characters',
  (t) => {
    const mikroMetric = MikroMetric.start(config);

    const error: any = t.throws(() => {
      mikroMetric.setProperty('$@][®˛π√ƒß', 'AnythingHere');
    });

    t.is(error.name, 'HasNonAsciiCharactersError');
  }
);

test.serial('It should throw a CannotAddMoreItemsToArrayError if an array is maxed out', (t) => {
  const mikroMetric = MikroMetric.start(config);

  const error: any = t.throws(() => {
    for (let x = 0; x <= 30; x++) {
      mikroMetric.putDimension(`${x}`, 'Testing');
    }
  });

  t.is(error.name, 'CannotAddMoreItemsToArrayError');
});

test.serial('It should throw a LengthNotWithinBoundsError if a string is too short', (t) => {
  const mikroMetric = MikroMetric.start(config);

  const error: any = t.throws(() => mikroMetric.setProperty('', ''));

  t.is(error.name, 'LengthNotWithinBoundsError');
});

test.serial('It should throw a LengthNotWithinBoundsError if a string is too long', (t) => {
  const mikroMetric = MikroMetric.start(config);

  const error: any = t.throws(() => {
    mikroMetric.setProperty(
      'alksjdpaoishdoiaushdoiuasgdoiuagdoi3t9387cgyaj,sbclaugsodiabtsod7civtao87sETVOa78etvoa87tDCSVOA87tsdvo8as7TDVO87TQ3V8C7DTASHJDGKajygsduaRTSD67arsdrvialksjdpaoishdoiaushdoiuasgdoiuagdoi3t9387cgyaj,sbclaugsodiabtsod7civtao87sETVOa78aldjh3fo8ahsliuhdaliusdghas',
      'Testing'
    );
  });

  t.is(error.name, 'LengthNotWithinBoundsError');
});
