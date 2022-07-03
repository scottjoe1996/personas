import { Construct } from 'constructs';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

import { CustomStackProps } from '../config/config';
import { DynamoDbProps } from './dynamo-db-props';
import { RemovalPolicy } from 'aws-cdk-lib';

export class DynamoDbConstruct extends Construct {
  constructor(scope: Construct, { customProps }: CustomStackProps<DynamoDbProps>) {
    super(scope, 'DynamoDbConstruct');

    const personasTable = new Table(this, 'PersonasTable', {
      tableName: customProps.dynamoDbTableName,
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'projectId',
        type: AttributeType.STRING
      },
      removalPolicy: RemovalPolicy.DESTROY
    });

    personasTable.grantFullAccess(customProps.resolverLambda);
  }
}
