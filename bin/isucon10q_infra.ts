#!/usr/bin/env node
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import { Isucon10QInfraStack } from '../lib/isucon10q_infra-stack';

const app = new cdk.App();
new Isucon10QInfraStack(app, 'Isucon10QInfraStack');
