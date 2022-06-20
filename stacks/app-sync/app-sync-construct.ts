import { Construct } from 'constructs';
import { join } from 'path';

import { CfnOutput, Duration } from 'aws-cdk-lib';

import { AuthorizationType, FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { AppSyncProps } from './app-sync-props';

export class AppSyncConstruct extends Construct {
  constructor(scope: Construct, _props?: AppSyncProps) {
    super(scope, 'AppSyncConstruct');

    const resolverLambdaFunction = new NodejsFunction(this, 'AppSyncResolverLambda', {
      entry: join(__dirname, '..', '..', 'app', 'resolvers', 'resolver.ts'),
      handler: 'resolve',
      functionName: 'app-sync-resolver-lambda',
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30)
    });

    const loggingServiceRole = new Role(this, 'LoggingServiceRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });
    loggingServiceRole.addToPolicy(
      new PolicyStatement({
        resources: ['*'],
        actions: ['cloudwatch:*', 'logs:*'],
        effect: Effect.ALLOW
      })
    );

    const api = new GraphqlApi(this, 'Api', {
      name: 'personas-api',
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      },
      logConfig: {
        role: loggingServiceRole,
        fieldLogLevel: FieldLogLevel.ALL
      },
      schema: Schema.fromAsset(join(__dirname, '..', '..', 'schema.graphql'))
    });

    const lambdaDataSource = api.addLambdaDataSource('LambdaDataSource', resolverLambdaFunction);

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'personas'
    });
    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'persona'
    });

    new CfnOutput(this, 'AppSyncApiKey', {
      value: api.apiKey || ''
    });
  }
}
