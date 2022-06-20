import { Construct } from 'constructs';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';

import { DynamoDbProps } from './dynamo-db-props';
import { RemovalPolicy } from 'aws-cdk-lib';

export class DynamoDbConstruct extends Construct {
  constructor(scope: Construct, props: DynamoDbProps) {
    super(scope, 'DynamoDbConstruct');

    const personasTable = new Table(this, 'PersonasTable', {
      tableName: 'personas',
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

    personasTable.grantFullAccess(props.resolverLambda);
  }
}
