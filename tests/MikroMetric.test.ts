import { test, expect } from 'vitest';

import { MikroMetric } from '../src/domain/entities/MikroMetric.js';

import event from '../testdata/event.json';
import context from '../testdata/context.json';
import {
  CannotAddMoreItemsToArrayError,
  HasNonAsciiCharactersError,
  LengthNotWithinBoundsError,
  MissingRequiredStartParamsError
} from '../src/application/errors/errors.js';

const config = {
  namespace: 'MyNamespace',
  serviceName: 'MyService',
  event,
  context
};
const configMinimal = { namespace: 'MyNamespace', serviceName: 'MyService' };

function setEnv() {
  process.env.AWS_REGION = 'eu-north-1';
  process.env.AWS_EXECUTION_ENV = 'AWS_Lambda_nodejs16.x';
  process.env.AWS_LAMBDA_FUNCTION_NAME = 'TestFunction';
  process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '512';
  process.env.AWS_LAMBDA_FUNCTION_VERSION = '$LATEST';
}

function clearEnv() {
  process.env.AWS_REGION = '';
  process.env.AWS_EXECUTION_ENV = '';
  process.env.AWS_LAMBDA_FUNCTION_NAME = '';
  process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE = '';
  process.env.AWS_LAMBDA_FUNCTION_VERSION = '';
}

/**
 * POSITIVE TESTS
 */
test('It should set the instance to a new one', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  const isInstance = mikroMetric instanceof MikroMetric;

  expect(isInstance).toBe(expected);
});

test('It should set custom static metadata', () => {
  const metadataConfig = {
    version: 1,
    hostPlatform: 'aws',
    owner: 'MyCompany',
    domain: 'MyDomain',
    system: 'MySystem',
    service: 'MyService',
    team: 'MyTeam',
    tags: ['backend', 'typescript', 'api', 'serverless', 'my-service'],
    dataSensitivity: 'proprietary'
  };

  const mikroMetric = MikroMetric.start({ ...config, metadataConfig });

  const expected = {
    accountId: '123412341234',
    correlationId: '6c933bd2-9535-45a8-b09c-84d00b4f50cc',
    dataSensitivity: 'proprietary',
    domain: 'MyDomain',
    functionMemorySize: '1024',
    functionName: 'somestack-FunctionName',
    functionVersion: '$LATEST',
    hostPlatform: 'aws',
    owner: 'MyCompany',
    region: 'eu-north-1',
    resource: '/functionName',
    service: 'MyService',
    stage: 'shared',
    system: 'MySystem',
    tags: ['backend', 'typescript', 'api', 'serverless', 'my-service'],
    team: 'MyTeam',
    timestampRequest: '1657389598171',
    user: 'some user',
    version: 1,
    viewerCountry: 'SE'
  };

  const result: any = mikroMetric.flush();
  delete result['_aws'];
  delete result['id'];
  delete result['timestamp'];
  delete result['timestampEpoch'];

  expect(result).toMatchObject(expected);
});

test('It should set AWS metadata with provided "event" and "context" objects', () => {
  const mikroMetric = MikroMetric.start(config);

  // Note: 'runtime' not present in event/context, only in AWS env
  const expected = {
    accountId: '123412341234',
    correlationId: '6c933bd2-9535-45a8-b09c-84d00b4f50cc',
    functionMemorySize: '1024',
    functionName: 'somestack-FunctionName',
    functionVersion: '$LATEST',
    region: 'eu-north-1',
    resource: '/functionName',
    service: 'MyService',
    stage: 'shared',
    timestampRequest: '1657389598171',
    user: 'some user',
    viewerCountry: 'SE'
  };

  const result: any = mikroMetric.flush();
  console.log('result', result);
  delete result['_aws'];
  delete result['id'];
  delete result['timestamp'];
  delete result['timestampEpoch'];

  expect(result).toMatchObject(expected);
});

test('It should set AWS metadata from environment', () => {
  setEnv();

  const mikroMetric = MikroMetric.start(configMinimal);

  const expected = {
    functionMemorySize: '512',
    functionName: 'TestFunction',
    functionVersion: '$LATEST',
    region: 'eu-north-1',
    runtime: 'AWS_Lambda_nodejs16.x',
    service: 'MyService'
  };

  const result: any = mikroMetric.flush();
  delete result['_aws'];
  delete result['id'];
  delete result['timestamp'];
  delete result['timestampEpoch'];

  expect(result).toMatchObject(expected);

  clearEnv();
});

test('It should keep directly set/put properties in output if the property name overlap with dynamic metadata', () => {
  setEnv();

  const expected = 'Sam Person';
  const mikroMetric = MikroMetric.start(config);

  mikroMetric.putMetric('user', expected);
  const result: any = mikroMetric.flush().user;

  expect(result).toMatchObject(expected);
  clearEnv();
});

test('It should work without AWS metadata', () => {
  const mikroMetric = MikroMetric.start(configMinimal);

  const expected = {
    service: 'MyService'
  };

  const result: any = mikroMetric.flush();
  delete result['_aws'];
  delete result['id'];
  delete result['timestamp'];
  delete result['timestampEpoch'];

  expect(result).toMatchObject(expected);
});

test('It should capture the namespace from the process environment', () => {
  const expected = 'MyNamespace';
  process.env.MIKROMETRIC_NAMESPACE = expected;

  const mikroMetric = MikroMetric.start({ serviceName: 'MyService' });

  const result = mikroMetric.getNamespace();
  expect(result).toBe(expected);
  process.env.MIKROMETRIC_NAMESPACE = '';
});

test('It should capture the service name from the process environment', () => {
  const expected = 'MyService';
  process.env.MIKROMETRIC_SERVICE_NAME = expected;

  const mikroMetric = MikroMetric.start({ namespace: 'MyNamespace' });

  const result = mikroMetric.getServiceName();
  expect(result).toBe(expected);
  process.env.MIKROMETRIC_SERVICE_NAME = '';
});

test('It should reset to a new instance', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putMetric('Duration', 83, 'Milliseconds');
  mikroMetric.reset();
  const log = mikroMetric.flush();

  const result = log._aws.CloudWatchMetrics[0].Metrics[0] === undefined;
  expect(result).toBe(expected);
});

test('It should set the correlation ID', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = 'asdf1234';

  mikroMetric.setCorrelationId(expected);
  const log = mikroMetric.flush();
  const result = log.correlationId;

  expect(result).toBe(expected);
});

test('It should set the namespace', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = 'MyNewNamespace';

  mikroMetric.setNamespace(expected);

  const result = mikroMetric.getNamespace();
  expect(result).toBe(expected);
});

test('It should put a dimension', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putDimension('user', 'Sam Person');
  const log = mikroMetric.flush();
  const dimensions = log._aws.CloudWatchMetrics[0].Dimensions[0];

  const result = dimensions.includes('user');
  expect(result).toBe(expected);
});

test('It should put a metric', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  const metricName = 'Duration';
  const metricCount = 83;

  mikroMetric.putMetric(metricName, metricCount, 'Milliseconds');
  const log = mikroMetric.flush();
  const metric = log._aws.CloudWatchMetrics[0].Metrics[0];

  const result = metric['Name'] === metricName && log[metricName] === metricCount;
  expect(result).toBe(expected);
});

test('It should put a metric with a zero value', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  const metricName = 'Failure';
  const metricCount = 0;

  mikroMetric.putMetric(metricName, metricCount, 'Count');
  const log = mikroMetric.flush();
  const metric = log._aws.CloudWatchMetrics[0].Metrics[0];

  const result = metric['Name'] === metricName && log[metricName] === metricCount;
  expect(result).toBe(expected);
});

test('It should put a metric without a unit provided', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = true;

  mikroMetric.putMetric('Duration', 83);
  const log = mikroMetric.flush();
  const metric = log._aws.CloudWatchMetrics[0].Metrics[0];

  const result = metric['Unit'] === 'None';
  expect(result).toBe(expected);
});

test('It should set a property', () => {
  const mikroMetric = MikroMetric.start(config);
  const expected = 'Something';
  const key = 'MyProperty';

  mikroMetric.setProperty(key, expected);
  const result = mikroMetric.flush();

  expect(result[key]).toBe(expected);
});

/**
 * FAILURE TESTS
 */
test('Starting without neither namespace or service name will throw a MissingRequiredStartParamsError', () => {
  expect(() => MikroMetric.start()).toThrow(MissingRequiredStartParamsError);
});

test('Starting without a service name will throw a MissingRequiredStartParamsError', () => {
  expect(() => MikroMetric.start({ namespace: 'MyNamespace' })).toThrow(
    MissingRequiredStartParamsError
  );
});

test('Starting without a namespace will throw a MissingRequiredStartParamsError', () => {
  expect(() => MikroMetric.start({ serviceName: 'MyService' })).toThrow(
    MissingRequiredStartParamsError
  );
});

test('It should throw a HasNonAsciiCharactersError if a string key contains non-ASCII characters', () => {
  const mikroMetric = MikroMetric.start(config);

  expect(() => mikroMetric.setProperty('$@][®˛π√ƒß', 'AnythingHere')).toThrow(
    HasNonAsciiCharactersError
  );
});

test('It should throw a CannotAddMoreItemsToArrayError if an array is maxed out', () => {
  const mikroMetric = MikroMetric.start(config);

  expect(() => {
    for (let x = 0; x <= 30; x++) {
      mikroMetric.putDimension(`${x}`, 'Testing');
    }
  }).toThrow(CannotAddMoreItemsToArrayError);
});

test('It should throw a LengthNotWithinBoundsError if a string is too short', () => {
  const mikroMetric = MikroMetric.start(config);

  expect(() => mikroMetric.setProperty('', '')).toThrow(LengthNotWithinBoundsError);
});

test('It should throw a LengthNotWithinBoundsError if a string is too long', () => {
  const mikroMetric = MikroMetric.start(config);

  expect(() =>
    mikroMetric.setProperty(
      'alksjdpaoishdoiaushdoiuasgdoiuagdoi3t9387cgyaj,sbclaugsodiabtsod7civtao87sETVOa78etvoa87tDCSVOA87tsdvo8as7TDVO87TQ3V8C7DTASHJDGKajygsduaRTSD67arsdrvialksjdpaoishdoiaushdoiuasgdoiuagdoi3t9387cgyaj,sbclaugsodiabtsod7civtao87sETVOa78aldjh3fo8ahsliuhdaliusdghas',
      'Testing'
    )
  ).toThrow(LengthNotWithinBoundsError);
});
