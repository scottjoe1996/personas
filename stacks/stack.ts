#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { AppSyncStack } from './app-sync/app-sync-stack';
import { DynamoDbStack } from './dynamo-db/dynamo-db-stack';
import { CONFIG, getStackProps } from './config/config';
import { AppSyncProps } from './app-sync/app-sync-props';
import { DynamoDbProps } from './dynamo-db/dynamo-db-props';

const app = new cdk.App();

const appSyncStack = new AppSyncStack(app, 'PersonasAppSync', getStackProps<AppSyncProps>({}));

new DynamoDbStack(
  app,
  'PersonasDynamoDb',
  getStackProps<DynamoDbProps>({ dynamoTableName: CONFIG.dynamoDbName, resolverLambda: appSyncStack.resolverLambdaFunction })
);
