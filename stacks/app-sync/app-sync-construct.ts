import { Construct } from 'constructs';

import { AppSyncProps } from './app-sync-props';

export class AppSyncConstruct extends Construct {
  constructor(scope: Construct, props?: AppSyncProps) {
    super(scope, 'AppSyncConstruct');
  }
}
