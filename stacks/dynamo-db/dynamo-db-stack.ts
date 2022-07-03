import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { CustomStackProps } from '../config/config';

import { DynamoDbConstruct } from './dynamo-db-construct';
import { DynamoDbProps } from './dynamo-db-props';

export class DynamoDbStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps<DynamoDbProps>) {
    super(scope, id, props);

    new DynamoDbConstruct(this, props);
  }
}
