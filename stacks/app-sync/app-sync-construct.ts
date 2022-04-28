import { Construct } from 'constructs';

import { CfnOutput } from 'aws-cdk-lib';
import * as appSync from 'aws-cdk-lib/aws-appsync';
import * as iam from 'aws-cdk-lib/aws-iam';

import { AppSyncProps } from './app-sync-props';

export class AppSyncConstruct extends Construct {
  constructor(scope: Construct, _props?: AppSyncProps) {
    super(scope, 'AppSyncConstruct');

    const loggingServiceRole = new iam.Role(this, 'LoggingServiceRole', {
      assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com')
    });

    loggingServiceRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['cloudwatch:*', 'logs:*'],
        effect: iam.Effect.ALLOW
      })
    );

    const api = new appSync.CfnGraphQLApi(this, 'Api', {
      name: 'personas-appsync-api',
      logConfig: {
        cloudWatchLogsRoleArn: loggingServiceRole.roleArn,
        fieldLogLevel: 'ALL'
      },
      authenticationType: 'API_KEY'
    });

    new appSync.CfnGraphQLSchema(this, 'ApiSchema', {
      apiId: api.attrApiId,
      definition: `
        type Persona {
          id: ID!
          name: String!
          role: String!
          quote: String!
          description: String!
        }
        
        type Query {
          persona(id: ID!): Persona
        }
      `
    });

    const apiKey = new appSync.CfnApiKey(this, 'ApiKey', {
      apiId: api.attrApiId
    });

    new CfnOutput(this, 'ApiKeyOutput', {
      value: apiKey.apiKeyId || ''
    });
  }
}
