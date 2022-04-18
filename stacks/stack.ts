#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { AppSyncStack } from './app-sync/app-sync-stack';

const DEFAULT_AWS_ENV = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const app = new cdk.App();

new AppSyncStack(app, 'AppSync', {
  env: DEFAULT_AWS_ENV
});
