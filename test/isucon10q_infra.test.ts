import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Isucon10QInfra from '../lib/isucon10q_infra-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Isucon10QInfra.Isucon10QInfraStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(matchTemplate({
    Resources: {},
  }, MatchStyle.EXACT));
});
