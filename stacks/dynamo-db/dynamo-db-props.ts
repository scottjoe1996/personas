import { StackProps } from 'aws-cdk-lib';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export interface DynamoDbProps extends StackProps {
  resolverLambda: NodejsFunction;
}
