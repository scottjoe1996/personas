import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { AppSyncConstruct } from './app-sync-construct';
import { AppSyncProps } from './app-sync-props';

export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, props?: AppSyncProps) {
    super(scope, id, props);

    new AppSyncConstruct(this, props);
  }
}
