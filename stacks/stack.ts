#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { AppSyncStack } from './app-sync/app-sync-stack';
import { DynamoDbStack } from './dynamo-db/dynamo-db-stack';
import { getStackProps } from './config/config';
import { AppSyncProps } from './app-sync/app-sync-props';
import { DynamoDbProps } from './dynamo-db/dynamo-db-props';

const DEFAULT_AWS_ENV = { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION };

const app = new cdk.App();

const appSyncStack = new AppSyncStack(app, 'PersonasAppSync', getStackProps<AppSyncProps>({}));

new DynamoDbStack(app, 'PersonasDynamoDb', getStackProps<DynamoDbProps>({ resolverLambda: appSyncStack.resolverLambdaFunction }));
