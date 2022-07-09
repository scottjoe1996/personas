import { Construct } from 'constructs';
import { join } from 'path';

import { CfnOutput, Duration, Fn } from 'aws-cdk-lib';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

import { AuthorizationType, FieldLogLevel, GraphqlApi, Schema } from '@aws-cdk/aws-appsync-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

import { CustomStackProps } from '../config/config';

import { AppSyncProps } from './app-sync-props';

export class AppSyncConstruct extends Construct {
  public readonly resolverLambdaFunction: NodejsFunction;

  constructor(scope: Construct, { customProps }: CustomStackProps<AppSyncProps>) {
    super(scope, 'AppSyncConstruct');

    this.resolverLambdaFunction = new NodejsFunction(this, 'AppSyncResolverLambda', {
      entry: join(__dirname, '..', '..', 'app', 'resolvers', 'resolver.ts'),
      handler: 'resolve',
      functionName: 'personas-app-sync-resolver-lambda',
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
      environment: {
        DYNAMO_DB_TABLE_NAME: customProps.dynamoDbTableName
      }
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

    const userPoolId = Fn.importValue('userPoolId');
    const userPool = UserPool.fromUserPoolId(this, 'UserPool', userPoolId);
    const api = new GraphqlApi(this, 'Api', {
      name: 'personas-api',
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool
          }
        }
      },
      logConfig: {
        role: loggingServiceRole,
        fieldLogLevel: FieldLogLevel.ALL
      },
      schema: Schema.fromAsset(join(__dirname, '..', '..', 'schema.graphql'))
    });

    const lambdaDataSource = api.addLambdaDataSource('LambdaDataSource', this.resolverLambdaFunction);

    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'personas'
    });
    lambdaDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'persona'
    });
    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createPersona'
    });
    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'editPersona'
    });
    lambdaDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'deletePersona'
    });

    new CfnOutput(this, 'AppSyncApiKey', {
      value: api.apiKey || ''
    });
  }
}
