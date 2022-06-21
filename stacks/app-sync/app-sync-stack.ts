import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { AppSyncConstruct } from './app-sync-construct';
import { AppSyncProps } from './app-sync-props';

export class AppSyncStack extends Stack {
  public readonly resolverLambdaFunction: NodejsFunction;

  constructor(scope: Construct, id: string, props?: AppSyncProps) {
    super(scope, id, props);

    const appSyncConstruct = new AppSyncConstruct(this, props);

    this.resolverLambdaFunction = appSyncConstruct.resolverLambdaFunction;
  }
}
